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
    
    // minimum (exclusive) boundary of letters (97-122 for a-z)
	// this means we can offset the codes for array indices :)
    MIN_CODE:96,
    
    // saved as a dict for convenience within the method
    ALPHA_WEIGHTS : { a:1, b:2, c:3, d:4, e:5, f:6,
            g:7, h:8, i:9, j:10, k:11,l:12,
            m:13,n:14,o:15,p:16,q:17,r:18,
            s:19,t:20,u:21,v:22,w:23,x:24,
            y:25,z:26
	},
	// Radix sorting tool
	RadixSorter : {
		// sorts an array of String values in arbitrary lexicographical order
		// based on 'arbLex', an arbitrary lexical odering rule of the characters
		// by the sorter. I.e. 'arbLex = czb' means:
		// c < z < b in sort order.
		sortlex:function(strings, arbLex){
			var sLen 			= strings == null ? 0 : strings.length;
			
			// early out prior to any unnecessary var creation
			if(sLen == 0){
				return strings;
			}
			
			// if an arbLex is provided, its characters will have their overridden weights placed here.
			OVERRIDE_WEIGHTS 	= {};
			
			// table to track the arbitrary weights of lexical strings (not chars)
			// based on 'arbLex'
			var lexWeights 		= {};
			
			// DEBUG Only
			var ops 			= 1;
			console.log("sortlex( strings: " + strings + " arbitrary lex: " + arbLex+ ")");
			
			
			// calculates the lexical weight of a string
			var lexWeight 		= function(inStr){
				var weight = 0;
				if(!lexWeights[inStr])
				{
					if(inStr != "" || inStr != null){
						for(var letterIdx = 0, strLen=inStr.length; letterIdx < strLen; /*omitted*/){
							
							var currWeight;
							if(!OVERRIDE_WEIGHTS[inStr.charAt(letterIdx)]){
								currWeight = Sorter.ALPHA_WEIGHTS[inStr.charAt(letterIdx)];
							}
							else{
								currWeight = OVERRIDE_WEIGHTS[inStr.charAt(letterIdx)];
							}
							currWeight = currWeight * Sorter.ALPHABET_LEN/( Sorter.ALPHABET_LEN * ++letterIdx);
							weight +=  currWeight;
						}
						
						lexWeights[inStr] = Math.floor( weight);
					}
				}
				else
				{
					weight = lexWeights[inStr];
				}
				
				return weight;
			};
			
			lexStrLen = arbLex == null ? 0 : arbLex.length;
			
			// setup lexicographical weights for incoming arbitrary lex string, if provided.
			if(lexStrLen > 0){
				
				for(var w= 0; w < lexStrLen; ++w ){
					var c = arbLex.charAt(w);
					OVERRIDE_WEIGHTS[c] = -1;
				}
		
				for(var w = 0, lexIdx = 0; w < Sorter.ALPHABET_LEN; ++w){
					
					defaultChar = String.fromCharCode(w+Sorter.MIN_CODE+1);
					
					if(OVERRIDE_WEIGHTS[defaultChar] == -1){
						OVERRIDE_WEIGHTS[defaultChar] = arbLex.charCodeAt(lexIdx++) - Sorter.MIN_CODE;
					}
				}
			}
			
			// boundary is initially 2. insure we can do the loop at least ONCE.
			var boundary 	= 2;
			var radix 		= 10;
			
			
			// sort using radix algorithm
			for(var run = 1; run < boundary; run *= radix )
			{
				var buckets = [];
				
				// create the buckets and push the characters into them
				for(var i = 0; i < sLen; ++i){
					
					var str			= strings[i];
					var strWeight 	= lexWeight(str);
					
					// on the first run, we'll determine the max value
					// and increase the boundary if needed.
					if(run == 1 && strWeight > boundary){
						boundary = strWeight;
					}
					
					var bcktIdx 	= Math.floor(strWeight/run) %radix;
					var bckt 		= buckets[bcktIdx];
					
					if(!bckt)
					{
						bckt = [];
						buckets[bcktIdx] = bckt;
					}
					
					// alternative to push, but i think its a tad faster
					bckt[bckt.length] = str;
				}
				
				for(var i = 0, sortIdx=0, bLen = buckets.length; i < bLen; /**/){
					
					var bckt 		= buckets[i++];
					
					// skip empty buckets.
					if(!bckt){continue;}
					var tbLen = bckt.length;
					
					if(tbLen > 0){
						for( var bcktIndex = 0 ; bcktIndex < tbLen; /**/){
							strings[sortIdx++] = bckt[bcktIndex++];
						}
					}
				}
			}
			
			return strings;
		}
	}
}




