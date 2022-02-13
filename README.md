## Distribution of the Target Multipliers

This page calculates the distribution of Target Multipliers of all enabled Defichain Masternodes.

The api call https://api.mydeficha.in/v1/listmasternodes/?state=ENABLED returns the data of all enabled masternodes, which are also shown in https://mydeficha.in/masternodes.php.

The Javascript code counts the number of sub-nodes for the target multiplier in the range 1 ... 57 and show the chart.
The api call need at least 1 s to returns about 5 MB of json data.  Therefore the distribution is cached  in the Local Storage of the browser for one hour.

### npm packages

npm install -g parcel  
npm install -g cross-env  
npm install -g gh-pages  
npm install -g typescript  
