/// <reference path="chart.d.ts" />
module targetMultipliers {

    const MaxTM= 57;
var tmDistribution= new Array<number>(MaxTM).fill(0);

interface IMasternode {
        "ownerAuthAddress":string,
		"operatorAuthAddress": string,
		"rewardAddress": string,
		"creationHeight": number,
		"resignHeight": number,
		"resignTx": string,
		"banTx": string,
		"state": string,
		"mintedBlocks": number,
		"ownerIsMine": boolean,
		"operatorIsMine": boolean,
		"localMasternode": boolean,
		"targetMultipliers": number[],
		"timelock": string
}

function setWithExpiry(key: string, value: string, ttl=3600000) {
	const item = {
		value: value,
		expiry: (new Date()).getTime() + ttl, //ttl in ms
	}
	localStorage.setItem(key, JSON.stringify(item))
}

function getWithExpiry(key: string) {
	const itemStr = localStorage.getItem(key)
	// if the item doesn't exist, return null
	if (!itemStr) {
		return null
	}
	const item = JSON.parse(itemStr)
	const now = new Date()
	// compare the expiry time of the item with the current time
    try {
        if (now.getTime() > item.expiry) {
            // If the item is expired, delete the item from storage and return null
            localStorage.removeItem(key)
            return null
        }            
    } catch (error) {
        localStorage.removeItem(key)
        return null    
    }
	return item.value
}

function getTargetMultipliers() {
    var result: number[];
    fetch('https://api.mydeficha.in/v1/listmasternodes/?state=ENABLED')
    .then(function(response){
        if (!response.ok) {
            console.error('HTTP error! status: ${response.status}');
        }
        return response.text();
    })
    .then(function(response) {
        var masternodes=JSON.parse(response); 
         Object.entries<IMasternode>(masternodes).forEach(
            ([key, value]) => {
                value.targetMultipliers.forEach(index => {
                    index -=1;
                    if (index < 0)
                        index = 0;
                    else if (index > MaxTM-1)
                        index = MaxTM-1;    
                    tmDistribution[index]++;
                    });                    
            }
        );
        setWithExpiry("tmDistribution",JSON.stringify(tmDistribution));
        setchart()   
    });
    return result;
}

function setchart(){
    const config = {
        type: 'bar',
        data: {
            labels: Array.from({length: MaxTM}, (_, i) => i + 1),
            datasets: [
              {
                label: "Distribution of the target multipliers",
                backgroundColor: '#ff8000' , 
                data: tmDistribution
              }
            ]
          },
      };

    let e = document.getElementById('bar-chart');
    //@ts-ignore
    var myChart = new Chart(e, config );
}


window.onload = () => {
    var s = getWithExpiry('tmDistribution');
    if (s) {
        tmDistribution = JSON.parse(s);
        setchart();
    } else {
        getTargetMultipliers();
    }
};

}