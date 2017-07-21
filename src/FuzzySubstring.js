'use strict';

/* 
 * Copyright 2017 Anthony Massie
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *    http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Fuzzy searches a substring for all best matches of a search string
 * using Levenshtein distance.
 */
class FuzzySubstring {
    /**
     * Calculates the Levenshtein distance for all substrings and returns their
     * distance and insertion-deletion offset.
     * 
     * @param {string} needle The search string.
     * @param {string} haystack The string to search.
     * 
     * @return {array} Array of all substring matches in pairs [distance, offset]
     */  
    getEditDistances(needle, haystack) {
        //first levenshtein row filled with [distance, offset] pairs
        //the offset tracks insertions-deletions for position calculation
        var row1 = new Array(haystack.length + 1).fill([0, 0]); 
        let min = 0; //keep track of smallest distance
        
        for(let i = 0; i < needle.length; i++) {
            let row2 = [[i+1, 0]]; //first column of the matrix
            
            for(let j = 0; j < haystack.length; j++) {
                let cost = needle[i] != haystack[j];
                
                let del = row1[j+1][0] + 1; //delete
                let ins = row2[j][0] + 1; //insert
                let sub = row1[j][0] + cost; //substitution
                let min = Math.min(del, Math.min(ins, sub));
                
                //defaut result as a substiution, no insertion-deletion cost
                let result = [min, row1[j][1]];
                
                //check if it's actually deletion or insertion
                //and adjust offset
                if(del === min) {
                    result[1] = row1[j+1][1] - 1; //substract cost offset
                //insertion
                } else if(ins === min) {
                    result[1] = row2[j][1] + 1; //add to cost offset
                }

                row2.push(result);
            }

            row1 = row2;
        }
       
        return row1;
    }
    
    /**
     * Search haystack for all instances of needle and returns an array of
     * objects containing string position and levenshtein distance.
     * 
     * @param {string} needle The search string.
     * @param {string} haystack The string to search.
     * 
     * @return {array} Array of best substring matches.
     */
    getMatches(needle, haystack) {
        //get levenshtein distances for all paths
        let matches = this.getEditDistances(needle, haystack);
        let indices = [0]; //prime the loop with min distance as first
        let min = matches[0][0]; //min distance from [distance, offset] pairs

        //get all of the indices of mathes with lowest levenshtein distance
        for(let i = 1; i < matches.length; i++) {
            let value = matches[i][0];

            //new smallest value
            if(value < min) {
                indices = [i];
                min = value;
            } else if(value == min) { //add duplicate smallest value
                indices.push(i);
            }
        }
      
        //compile the results
        let results = [];
        
        for(let i of indices) {
            let match = matches[i];
            
            let result = {
                'distance': match[0],
                'start': i - needle.length - match[1], //simplification of startPos = endPos − (needleLength + insertions − deletions)
                'end': i
            }
            
            results.push(result);
        }
        
        return results;
    }
    
}

module.exports = FuzzySubstring;