import * as R from "ramda";

const stringToArray = R.split("");

/* Question 1 */
const vowels: string[] = ['a', 'e', 'i', 'o', 'u'];
export const countVowels: (s: string) => number = R.pipe(
    R.toLower,
    stringToArray,
    R.filter(R.includes(R.__, vowels)),
    R.length
);

/* Question 2 */
export const isPalindrome=(s:string): boolean =>(
    checkEqual
    (rev(stringToArray(s).filter(isLetter),
    buildArray(stringToArray(s).filter(isLetter).length),0),
    stringToArray(s).filter(isLetter),
    0,
0
)
);



const rev=(arr1: string[],arr2: string[],index:number):any =>(
    index <arr1.length ?
    (arr2[arr2.length-index-1]=arr1[index],
    
    rev(arr1,arr2,index+1))
    :arr2
) 
const buildArray = (size: number): string[] => Array(size).fill(""); 
const checkEqual = (arr1: string[], arr2: string[], ind1: number, ind2: number): boolean =>
    ind1 >= arr1.length && ind2 >= arr2.length
      ? true
      : ind1 >= arr1.length || ind2 >= arr2.length
      ? false
      :  isLetterEqual(arr1[ind1], arr2[ind2])
      ? checkEqual(arr1, arr2, ind1 + 1, ind2 + 1)
      : false;
  
  const isLetter = (ch: string): boolean => (
     (ch.charCodeAt(0) >= 65 && ch.charCodeAt(0) <= 90) || (ch.charCodeAt(0) >= 97 && ch.charCodeAt(0) <= 122)
  )
  const isLetterEqual=(ch1 :string , ch2 :string) : boolean =>(
    ch1.charCodeAt(0)-65==ch2.charCodeAt(0)-65||
    ch1.charCodeAt(0)-65==ch2.charCodeAt(0)-97 ||
    ch1.charCodeAt(0)-97==ch2.charCodeAt(0)-97||
    ch1.charCodeAt(0)-97==ch2.charCodeAt(0)-65
  )

/* Question 3 */
export type WordTree = {
    root: string;
    children: WordTree[];
}

export const treeToSentence = (wt: WordTree): string => 
    wt.children.length === 0 ? wt.root : wt.root + " " + R.map(treeToSentence,wt.children).join(" ");
