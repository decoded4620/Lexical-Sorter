/**
 * Sorting Tools
 * @author TheTechnoViking (Bow M. Archer)
 * 
 * 
 */

// Main Namespace
var Sorter = {
	// the total number of unique weighted values in our sorting alphabet
	// (both for arbLex, as well as content within strings)
    ALPHABET_LEN:26,
    FIBO_BIG:733,
    // minimum (exclusive) boundary of letters (97-122 for a-z)
	// this means we can offset the codes for array indices :)
    MIN_CODE:96,
    
    lastOpsValue:0,
    lastSetupOpsValue:0,
    // saved as a dict for convenience within the method
    ALPHA_WEIGHTS : { 
    		a:1, b:2, c:3, d:4, e:5, f:6, g:7, h:8, i:9, j:10, k:11,l:12,m:13,
    		n:14,o:15,p:16,q:17,r:18, s:19,t:20,u:21,v:22,w:23,x:24,y:25,z:26
	},
    // Radix sorting tool
    RadixSorter : {
        // sorts an array of String values in arbitrary lexicographical order
        // based on 'arbLex', an arbitrary lexical odering rule of the
        // characters
        // by the sorter. I.e. 'arbLex = czb' means:
        // c < z < b in sort order.
        sortlex : function(strings, arbLex) {
            lastOpsValue = 0;
            lastSetupOpsValue = 0;
            var sLen = strings == null ? 0 : strings.length;

            // early out prior to any unnecessary var creation
            if (sLen == 0) { return strings; }

            // if an arbLex is provided, its characters will have their
            // overridden weights placed here.
            var weightOverrides = {};

            // table to track the arbitrary weights of lexical strings (not
            // chars) based on 'arbLex'
            var lexWghtCache = {};

            var ops = 1;

            // calculates the lexical weight of a string
            var lexWeight = function(inStr) {

                var weight = 0;

                if (!lexWghtCache[inStr]) {

                    if (inStr != "" || inStr != null) {

                        var char = null
                        var currWeight;

                        for (var letterIdx = 0, strLen = inStr.length; letterIdx < strLen; /* omitted */) {
                            ops++;
                            currChar = inStr.charAt(letterIdx);
                            currWeight = weightOverrides[currChar] || Sorter.ALPHA_WEIGHTS[currChar];
                            
                            currWeight =  currWeight * Sorter.FIBO_BIG / (Sorter.FIBO_BIG * ++letterIdx);
                            weight += currWeight;
                        }
                        lexWghtCache[inStr] = (Math.round(weight*10000));
                        weight = lexWghtCache[inStr];
                    }
                } else {
                    // read from cache
                    weight = lexWghtCache[inStr];
                }
                
                return weight;
            };

            lexStrLen = arbLex == null ? 0 : arbLex.length;

            // if arbLex is provided
            if (lexStrLen > 0) {
                for (var w = 0; w < lexStrLen; w++) {
                    ops++;
                    weightOverrides[arbLex.charAt(w)] = -1;
                }
                // setup lexicographical weights for incoming arbitrary lex
                // string, if provided.
                for (var w = 0, lexIdx = 0; w < Sorter.ALPHABET_LEN; ++w) {
                    
                    var defaultChar = String.fromCharCode(w + Sorter.MIN_CODE + 1);
                    ops++;
                    
                    if (weightOverrides[defaultChar] == -1) {
                        weightOverrides[defaultChar] = arbLex.charCodeAt(lexIdx++) - Sorter.MIN_CODE;
                    }
                }
            }
            
            
           Sorter.lastSetupOpsValue = ops;
            // boundary is initially 2. insure we can do the loop at least ONCE.
            var boundary = 2;
            var radix = 10;

            // sort using radix algorithm
            for (var run = 1; run < boundary; run *= radix) {
                var buckets = [];

                // create the buckets and push the characters into them
                for (var i = 0; i < sLen; ++i) {
                    ops++;
                    
                    var str = strings[i];
                    var strWeight = lexWeight(str);

                    // on the first run, we'll determine the max value
                    // and increase the boundary if needed.
                    if (run == 1 && strWeight > boundary) {
                        boundary = strWeight;
                    }

                    var bcktIdx = Math.floor(strWeight / run) % radix;
                    var bckt = buckets[bcktIdx];

                    if (!bckt) {
                        bckt = [];
                        buckets[bcktIdx] = bckt;
                    }

                    // alternative to push, but i think its a tad faster
                    bckt[bckt.length] = str;
                }
                
                for (var i = 0, sortIdx = 0, bLen = buckets.length; i < bLen; /**/) {

                    var bckt = buckets[i++];

                    // skip empty buckets.
                    if (!bckt) {
                        continue;
                    }
                    var tbLen = bckt.length;

                    if (tbLen > 0) {
                        for (var bcktIndex = 0; bcktIndex < tbLen; /**/) {
                            ops++;
                            strings[sortIdx++] = bckt[bcktIndex++];
                        }
                    }
                }
            }
            Sorter.lastOpsValue = ops;
            
            return strings;
        }
    }
}




