# AttibeeJS Fuzzy Substring

Used to create flexible configuration of classes including support for default
values.

## Installation

`npm install @attibee/fuzzy-substring`

## Usage

```javascript
var FuzzySubstring = require('@attibee/fuzzy-substring');
var needle = 'apple';
var haystack = 'app1e potato appIe';

//search haystack for needle
var results = new FuzzySubstring().getMatches('apple', 'app1e potato apble');

//output results
for(let result of results) {
    var substring = haystack.substring(result.start, result.end);
    var distance = result.distance;
    
    console.log('Distance: ' + distance + '  Match: ' + substring);
}

// Output:
// Distance: 1  Match: app1e
// Distance: 1  Match: appIe
```
