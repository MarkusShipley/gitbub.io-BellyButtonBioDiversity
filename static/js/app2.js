// Function that populates the dropdown
function populateDropdown(){
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
    demoInfo('940');
    buildGraph('940');
    
}

// OptionChange is the main function that drives everything
// The OptionChange drives or initiliaizes the updates of the other table, bar chart and Bubble chart
// By the change in the idnumber from the dataset
function optionChanged(idNumber){
    console.log(idNumber)
    
    // call the funcions
    // note: as cpvered in Phil's study hall on 3/23/22, you can call a fucntion that is built later in the JS
     demoInfo(idNumber);
    buildGraph(idNumber);

}


// demographic info fuction
function demoInfo (idNumber) {
    // d3 select of the metadata div
    var demList = d3.select("#sample-metadata");

    // Using d3 to import the data
    d3.json('samples.json').then((data) => {
        // getting the metadata
        var metadata = data.metadata;

        // filtering metadata with the idNumber
        var filtered = metadata.filter(d => d.id == idNumber);

        // getting the filtered data
        filtered = filtered[0];

        // clearing out any existing data in my demoList
        demoList.html("");

        // iteraing throught the object and appending the 
        Object.entries(filtered).forEach(([key,value]) => {
            demoList.append("h6").text(`${key} : ${value}`);
        });

    });


}

// A funtion was created that will build the graphs 
function buildGraph (idNumber) {
    // filter through the samples
    d3.json('samples.json').then((data) => {
        // getting the metadata
        var sampleData = data.samples;

        // filtering metadata along the idNumber
        var filtered = sampleData.filter(d => d.id == idNumber);

        // getting the labels, sample values and ids usimg he filter function
        var otuIds = filtered[0]['otu_ids'];
        var sampleValues = filtered[0]['sample_values']
        var otuLabels = filtered[0]['otu_labels']
    
       

        // Create tje horixontal Bar Chart
        //data must me siced and tjhen invesred chosen to get the top ten by belly button
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

        Plotly.newPlot('bar', barData, barLayout);
        
        // Create the Bubble Chart
        var bubbleTrace = {
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

        var bubbleData = [bubbleTrace];

        var bubbleLayout = {
            title: "Bacteria Counts per Belly Button",
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Sample Values"}
        };

        Plotly.newPlot('bubble', bubbleData, bubbleLayout)

        
    });

}

populateDropdown();
   
 // Gauge chart
 var Gauge_chart = [
    {
      type: "indicator",
      mode: "gauge+idnumber+delta",
      value: data,
      title: { text: "Belly Button Washing Frequency <br><i>Scrubs per Week</i>", font: { size: 20 } },
      gauge: {
        axis: { range: [null, 10], tickwidth: 2, tickcolor: "black" },
        bar: { color: "#FF0000" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "black",
        steps: [
          { range: [0, 1], color: "#FFDCCC" },
          { range: [1, 2], color: "#FFCAB3"},
          { range: [2, 3], color: "#FFB999" },
          { range: [3, 4], color: "#FFA780"},
          { range: [4, 5], color: "#FF9566" },
          { range: [5, 6], color: "#FF844D"},
          { range: [6, 7], color: "#FF7233"},
          { range: [7, 8], color: "#FF9566" },
          { range: [9, 10], color: "#FF844D"}
    
         
        ]

//Plotly.newPlot('gauge',data);
