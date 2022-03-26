// Function that populates the dropdown
//Select #dataset is used because it is referred to as that on line 26 of the html
function Dropdown(){
    var select = d3.select("#selDataset");
    d3.json('samples.json').then((data) => {
        // console.log(data.names);

        var names = data.names;
        names.forEach((id) =>{
            select.append("option")
            .text(id)
            .property("value", id)
        });

    });

    // initiate Graphs
    // note: as covered in Phil's study hall on 3/23/22, you can call a fucntion that is built later in the JS
    demoGraphicInfo('940');
    graphBuilder('940');
    
}
// OptionChange is the main function that drives everything
// The OptionChange drives or initiliaizes the updates of the other table, bar chart and Bubble chart
// By the change in the idnumber from the dataset
function optionChanged(idNumber){
    //console.log(idNumber)    
    
    // note: as cpvered in Phil's study hall on 3/23/22, you can call a fucntion that is built later in the JS
     demoGraphicInfo(idNumber);
     graphBuilder(idNumber);

}
//creating function of demographic info
function demoGraphicInfo (idNumber) {
    // using d3 ro select the metadata div
    // demoGraphList not declared until line 60
    // #samples-metadata was used because it is reference in line 32 of the index.html
    var demoGraphicList = d3.select("#sample-metadata");

    // d3 is importing the metadata frp, tjr samples/json file
    // => are just shorter or easier ways of declaring functions
    //Phil covered this is study hall so I took a stab at seeing if I could get it to work
    //https://www.w3schools.com/js/js_arrow_function.asp

    d3.json('samples.json').then((data) => {
        // using d3 ro retrieve the the metadata
        var metadata = data.metadata;

        // filtering metadata by idnumber and acquiring the filtered data
        //https://www.geeksforgeeks.org/javascript-array-filter-method/
        var filtered = metadata.filter(d => d.id == idNumber);
        filtered = filtered[0];

        // making certain the deomGraphicList is cleared out
        //probably not neded for our homework purposes but in real life, I would want to make sure nothing remained if i updated datasets.
        demoGraphicList.html("");

        //iteraing through the object and appending the deomGraphicList
        //https://masteringjs.io/tutorials/fundamentals/filter-key#:~:text=JavaScript%20objects%20don't%20have,()%20function%20as%20shown%20below.
        //https://stackabuse.com/how-to-filter-an-object-by-key-in-javascript/
        //https://www.w3schools.com/js/js_objects.asp
        //This is repopulating the "clear" we made in lines 56

        Object.entries(filtered).forEach(([key,value]) => {
            demoGraphicList.append("h6").text(`${key} : ${value}`);
        });

    });

}

// A funtion was created that will build the graphs 
// First part is declaring variables and setting values so that they can be used when the graphs are generated
//https://plotly.com/javascript/plotlyjs-function-reference/
//https://plotly.com/javascript/reference/
function graphBuilder (idNumber) {
    
    d3.json('samples.json').then((data) => {
        var sampleData = data.samples;

        // filtering metadata along the idNumber
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
        // lveraging filtering fucntion to get the labels, sample values and ids.
        var filtered = sampleData.filter(d => d.id == idNumber);
       
        //Once the filtered var is declared and values set to it, the var can be used with the setting of the other vars
        var otuIds = filtered[0]['otu_ids'];
        var sampleValues = filtered[0]['sample_values']
        var otuLabels = filtered[0]['otu_labels']       
        // Create the horixontal Bar Chart
        //data must me siced and then the invesred chosen to get the top ten by belly button
        //to present in the chart propertly
        //sampleVlues amd otuIDs and otuLabels are vars declared in line 88-90
        var barTrace = {
            x: sampleValues.slice(0,10).reverse(),
            y: otuIds.map(otu_ids => `OTU ${otu_ids}`).slice(0,10).reverse(),
            type: 'bar',
            orientation: "h",
            text: otuLabels.slice(0,10).reverse(),
            marker: {
              color: 'rgb(112, 148, 219)'
            }
        };

        var barData = [barTrace];
        var barLayout = {
            title: "Top Bacteria per Belly Button",
            xaxis: {title: "Sample Value"},
            yaxis: {title: "OTU ID's"}
        };
        //used the barData and barLayout vars in the graphBuilder function to pass to the Plotly function to pass paramaters for the graph
        Plotly.newPlot('bar', barData, barLayout);
        
        // Create the Bubble Chart
        //used the barData and barLayout vars in the graphBuilder function to pass to the Plotly function to pass paramaters for the bubble trace
        var bubbletrace = {
            x: otuIds,
            y: sampleValues,
            mode: 'markers',
            text: otuLabels,
            marker: {
              size: sampleValues,
              color: otuIds,
              colorscale: "Earth"
            }
          };

        var bubbledata = [bubbletrace];
        var bubblelayout = {
            title: "Bacteria Counts per Belly Button",
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Sample Values"}
        };
        //Used the bubbletrace, bubbledata and bubble layout vars to pass the values to Plotly to create the newplots
        Plotly.newPlot('bubble', bubbledata, bubblelayout)
        //The appraoch with the graphbuilder function was used in anticitpation that it could be re-used and it makes the organization of the required plotly paramters more organizwd

    });

}

Dropdown();

//Originially, I attempted to build the the bonus gauge but just cpoiuld not make it happen.
//Thus, Bonus skipped for this.