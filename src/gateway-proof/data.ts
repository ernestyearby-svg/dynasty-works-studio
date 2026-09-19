export const studies=[
 {name:'OBJECT ZERO',short:'Physical',discipline:'Physical Intelligence',slug:'3d-product',verb:'Inspect the assembly.',copy:'Separate a physical object into its parts. Examine how material, section and assembly change its expression.'},
 {name:'LIVING CANVAS',short:'Experience',discipline:'Experience Intelligence',slug:'web',verb:'Enter a changing composition.',copy:'Move through an editorial environment in which typography, space and interaction act together.'},
 {name:'SOVEREIGN OS',short:'Operational',discipline:'Operational Intelligence',slug:'os',verb:'Bring decisions into focus.',copy:'Explore an executive environment through Now, System and Horizon. Orient attention across different timescales.'},
 {name:'SIGNAL',short:'Adaptive',discipline:'Personal / Adaptive Intelligence',slug:'mobile',verb:'Reorganize attention.',copy:'Explore how an interface responds to intent, time and context without losing its human scale.'},
 {name:'FORM',short:'Identity',discipline:'Identity Intelligence',slug:'identity',verb:'Follow one mark into a system.',copy:'Change the expression of a single seed and examine the relationships that make an identity recognizable.'},
 {name:'SURFACE / STRUCTURE',short:'Structural',discipline:'Packaging / Structural Intelligence',slug:'packaging',verb:'Give a surface dimension.',copy:'Follow a sheet through folding, enclosure and reveal. Inspect structure and material as one packaging system.'},
 {name:'CAPITAL',short:'Capital',discipline:'Business / Capital Intelligence',slug:'capital',verb:'Trace a financial consequence.',copy:'Change an illustrative assumption and follow its consequences through the business model.'},
 {name:'ORCHESTRATION',short:'Execution',discipline:'Automation / Execution Intelligence',slug:'orchestration',verb:'Trace intent into execution.',copy:'Follow a request through preparation, human authorization and an auditable execution sequence.'},
 {name:'SPACE',short:'Spatial',discipline:'Spatial Intelligence',slug:'space',verb:'Read an environment at human scale.',copy:'Explore the relationship between plan, structure and occupation in a dimensional spatial study.'},
];
export const relationships:Record<number,{id:number;why:string}[]>={
 0:[{id:5,why:'A physical object needs a structure that contains and presents it.'},{id:8,why:'Scale and occupation place the object in an environment.'},{id:4,why:'Material and proportion carry recognizable identity.'}],
 1:[{id:4,why:'Identity sets the language an experience speaks.'},{id:3,why:'Context changes how people encounter an interface.'},{id:8,why:'Sequence and space shape the experience of moving through it.'}],
 2:[{id:7,why:'An operating decision needs an execution path.'},{id:6,why:'Resources and constraints inform that decision.'},{id:3,why:'The interface adapts attention to the moment.'}],
 3:[{id:1,why:'Adaptation shapes a person’s experience.'},{id:2,why:'Attention supports the next operating decision.'},{id:7,why:'Intent must become a controlled action.'}],
 4:[{id:0,why:'Physical form carries the identity.'},{id:5,why:'Packaging extends identity into structure.'},{id:1,why:'An experience expresses the same recognizable language.'}],
 5:[{id:0,why:'Structure accommodates the object.'},{id:4,why:'Identity remains legible across its surfaces.'},{id:8,why:'Volume and reveal are spatial relationships.'}],
 6:[{id:2,why:'Economics informs operating choices.'},{id:7,why:'Execution consumes finite resources.'},{id:0,why:'Physical decisions have cost and capacity implications.'}],
 7:[{id:2,why:'Execution follows an accountable operating decision.'},{id:6,why:'Resources constrain the execution envelope.'},{id:3,why:'The right context determines the next action.'}],
 8:[{id:0,why:'Physical form establishes scale.'},{id:5,why:'Planes and enclosures define spatial boundaries.'},{id:1,why:'Movement turns space into experience.'}],
};
export const intents=[
 {name:'A brand',mix:[1,3,4],line:'Recognition, carried into use.'},
 {name:'A product',mix:[0,1,4,5],line:'Form, identity and the way it is encountered.'},
 {name:'A digital experience',mix:[1,2,3,4],line:'An interface with a point of view.'},
 {name:'An operating system',mix:[2,3,6,7],line:'Decisions connected to consequences.'},
 {name:'A launch',mix:[1,4,6,7],line:'Expression, resources and coordinated execution.'},
 {name:'A capital story',mix:[2,6],line:'A business proposition that can be examined.'},
 {name:'An automation system',mix:[2,3,7],line:'Intent made executable. Authority retained.'},
 {name:'A physical experience',mix:[0,1,5,8],line:'A place, its objects and the way people move.'},
 {name:'A company',mix:[1,2,4,6,7],line:'Different disciplines. One operating idea.'},
];
export const studyHref=(i:number)=>'/capability-lab/'+studies[i].slug;
