// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // console.log(data);
    // console.log(sample);
    
    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const selected_object = metadata.find(metadata_ => metadata_.id == sample);
    console.log(selected_object);

    // Use d3 to select the panel with id of `#sample-metadata`
    const metadataPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metadataPanel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    
    let metadataString = "";

    for (const key in selected_object) {
      if (selected_object.hasOwnProperty(key)) {
          metadataString += `${key.toUpperCase()}: ${selected_object[key]}<br>`;
      }
    }

    // Display the metadata string in the panel
    metadataPanel.html(metadataString);

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    // console.log(samples);

    const selected_sample = samples.find(sample_ => sample_.id === sample);
    // console.log(selected_sample);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = selected_sample.otu_ids;
    let otu_labels = selected_sample.otu_labels;
    let sample_values = selected_sample.sample_values;

    // Build a Bubble Chart
    var bubble_trace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    };
    

    var bubble_data = [bubble_trace];

    var bubble_layout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {
          title: 'OTU ID' // Label for the x-axis
      },
      yaxis: {
          title: 'Number of Bacteria' // Label for the y-axis
      }
    };
    

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubble_data, bubble_layout);
    

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const yticks = otu_ids.map(otu_id => "OTU " + otu_id);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately

    const combinedData = sample_values.map((value, index) => ({
      value: value,
      label: yticks[index],
      hover: otu_labels[index]
    }));

    // Sort the combined data by sample_values in descending order
    combinedData.sort((a, b) => b.value - a.value);

    // Slice the first 10 objects
    const topTenData = combinedData.slice(0, 10);

    // Reverse the sliced array
    const reversedData = topTenData.reverse();
    // console.log(reversedData);

    var data = [{
      type: 'bar',
      x: reversedData.map(item => item.value),
      y: reversedData.map(item => item.label),
      orientation: 'h',
      text: reversedData.map(item => item.hover), // Hover text for each bar
      hoverinfo: 'text' // Show only the hover text,
      
    }];

    const layout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: {
          title: 'Number of Bacteria' // Label for the x-axis
      }
  };


    // Render the Bar Chart
    Plotly.newPlot('bar', data, layout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // console.log(data);
    // Get the names field
    const names = data.names;
    // console.log(names);

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    const samples = data.samples;

    samples.forEach(function(sample_name) {
      dropdown.append("option") // Append a new option element
          .text(sample_name.id)           // Set the text of the option
          .attr("value", sample_name.id); // Set the value attribute of the option
      });


    // Get the first sample from the list
    let selectedValue = dropdown.property("value");
    // console.log(selectedValue); 

    // Build charts and metadata panel with the first sample
    buildCharts(selectedValue);

    buildMetadata(selectedValue);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
