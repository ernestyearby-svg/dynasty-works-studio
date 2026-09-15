Add-Type -AssemblyName System.Drawing
function Convert-BrandText([string]$Label,[System.Drawing.FontStyle]$Style) {
  $p=New-Object System.Drawing.Drawing2D.GraphicsPath
  $family=New-Object System.Drawing.FontFamily('Arial')
  $p.AddString($Label,$family,[int]$Style,100,[System.Drawing.PointF]::new(0,0),[System.Drawing.StringFormat]::GenericTypographic)
  $points=$p.PathPoints; $types=$p.PathTypes; $commands=New-Object System.Collections.Generic.List[string]
  for($i=0;$i -lt $points.Length;$i++) {
    $t=$types[$i] -band 7
    $x=$points[$i].X.ToString('0.###',[cultureinfo]::InvariantCulture); $y=$points[$i].Y.ToString('0.###',[cultureinfo]::InvariantCulture)
    if($t -eq 0){$commands.Add("M$x $y")}
    elseif($t -eq 1){$commands.Add("L$x $y")}
    elseif($t -eq 3){
      $x2=$points[$i+1].X.ToString('0.###',[cultureinfo]::InvariantCulture); $y2=$points[$i+1].Y.ToString('0.###',[cultureinfo]::InvariantCulture)
      $x3=$points[$i+2].X.ToString('0.###',[cultureinfo]::InvariantCulture); $y3=$points[$i+2].Y.ToString('0.###',[cultureinfo]::InvariantCulture)
      $commands.Add("C$x $y $x2 $y2 $x3 $y3"); $i+=2
    }
    if(($types[$i] -band 128) -ne 0){$commands.Add('Z')}
  }
  $bounds=$p.GetBounds(); $result=@{d=($commands -join ' '); x=$bounds.X; y=$bounds.Y; width=$bounds.Width; height=$bounds.Height}; $p.Dispose();$family.Dispose();return $result
}
@{brand=(Convert-BrandText 'DYNASTY WORKS' ([System.Drawing.FontStyle]::Bold));descriptor=(Convert-BrandText 'STUDIO' ([System.Drawing.FontStyle]::Regular))} | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath 'brand-source/wordmark-paths.json' -Encoding utf8
