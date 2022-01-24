var targetMultipliers;
(function (targetMultipliers) {
    var MaxTM = 57;
    var tmDistribution = new Array(MaxTM).fill(0);
    function setWithExpiry(key, value, ttl) {
        if (ttl === void 0) { ttl = 3600000; }
        var item = {
            value: value,
            expiry: (new Date()).getTime() + ttl, //ttl in ms
        };
        localStorage.setItem(key, JSON.stringify(item));
    }
    function getWithExpiry(key) {
        var itemStr = localStorage.getItem(key);
        // if the item doesn't exist, return null
        if (!itemStr) {
            return null;
        }
        var item = JSON.parse(itemStr);
        var now = new Date();
        // compare the expiry time of the item with the current time
        try {
            if (now.getTime() > item.expiry) {
                // If the item is expired, delete the item from storage and return null
                localStorage.removeItem(key);
                return null;
            }
        }
        catch (error) {
            localStorage.removeItem(key);
            return null;
        }
        return item.value;
    }
    function getTargetMultipliers() {
        var result;
        fetch('https://api.mydeficha.in/v1/listmasternodes/?state=ENABLED')
            .then(function (response) {
            if (!response.ok) {
                console.error('HTTP error! status: ${response.status}');
            }
            return response.text();
        })
            .then(function (response) {
            var masternodes = JSON.parse(response);
            Object.entries(masternodes).forEach(function (_a) {
                var key = _a[0], value = _a[1];
                value.targetMultipliers.forEach(function (index) {
                    index -= 1;
                    if (index < 0)
                        index = 0;
                    else if (index > MaxTM - 1)
                        index = MaxTM - 1;
                    tmDistribution[index]++;
                });
            });
            setWithExpiry("tmDistribution", JSON.stringify(tmDistribution));
            setchart();
        });
        return result;
    }
    function setchart() {
        var config = {
            type: 'bar',
            data: {
                labels: Array.from({ length: MaxTM }, function (_, i) { return i + 1; }),
                datasets: [
                    {
                        label: "Distribution of the target multipliers",
                        backgroundColor: '#ff8000',
                        data: tmDistribution
                    }
                ]
            },
        };
        var e = document.getElementById('bar-chart');
        var myChart = new Chart(e, config);
    }
    window.onload = function () {
        var s = getWithExpiry('tmDistribution');
        if (s) {
            tmDistribution = JSON.parse(s);
            setchart();
        }
        else {
            getTargetMultipliers();
        }
    };
})(targetMultipliers || (targetMultipliers = {}));