#!/bin/bash

# Path to your quotes.json
quotes_file="static/quotes.json"
output_file="static/cowsay_quotes.json"

# Initialize an empty JSON array to hold the cowsay quotes
echo "{" > $output_file
echo '  "quotes": [' >> $output_file

# Read the quotes from the JSON file
quotes=$(jq '.quotes[] | .quote' $quotes_file)

echo "${quotes[1]}"

# Generate cowsay text for each quote and store it in a JSON array
first=true
for quote in $quotes; do
    # Generate cowsay output for the entire quote
    cowsay_output=$(echo "$quote" | cowsay -n)

    # Escape newlines in the cowsay output to store it as a single string
    escaped_cowsay_output=$(echo "$cowsay_output" | sed ':a;N;$!ba;s/\n/\\n/g')

    # If it's the first entry, don't add a comma before it
    if [ "$first" = true ]; then
        echo "    {\"quote\": \"$escaped_cowsay_output\"}" >> $output_file
        first=false
    else
        echo "    ,{\"quote\": \"$escaped_cowsay_output\"}" >> $output_file
    fi
done

# Close the JSON array and object
echo '  ]' >> $output_file
echo "}" >> $output_file

echo "Cowsay quotes have been generated and saved to $output_file"
