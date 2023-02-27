var screen_main = document.getElementsByTagName("main")[0];
var screen_summary = document.getElementById("summary-sentences");
var screen_summary_footer = document.getElementById("summary-sentences-footer");
var screen_detail = document.getElementById("detail-paragraphs");
var screen_fullText = document.getElementById("fullText");

var uncovering_button = document.getElementById("uncovering-button");
var showing_fullText_button = document.getElementById("showing-fullText-button");
var hiding_fullText_button = document.getElementById("hiding-fullText-button");


/* ------- main UI/UX functions ------ */

// uncover the next summary sentence & detail paragraph just after clicking the #uncovering-button.
function letsUncover() {
	var prevSummary = document.getElementsByClassName("focused-sentence")[0];
	var nextSummary = document.getElementsByClassName("covered-sentence")[0];
	var prevDetail = document.getElementsByClassName("shown-detail")[0];
	var nextDetail = match_detailArticle( nextSummary );
	var nextPARTnumber = match_PARTnumber( nextSummary );
	var nextPARTclass = "class-part-" + nextPARTnumber;
	
	prevSummary.classList.remove('focused-sentence');
	nextSummary.classList.remove('covered-sentence');
	nextSummary.classList.add('focused-sentence');
	nextSummary.parentElement.parentElement.classList.remove('covered-section');
	nextSummary.addEventListener('click', function(event) {
		var targetElement = event.target;
		letsRewind( targetElement ); 
	});
	screen_summary_footer.scrollIntoView();
	
	prevDetail.classList.remove('shown-detail');
	nextDetail.classList.add('shown-detail');
	screen_detail.scrollTo(0,0);
	
	screen_main.classList.remove('class-part-1', 'class-part-2', 'class-part-3', 'class-empty-detail');
	screen_main.classList.add(nextPARTclass);
	if (nextDetail.classList.contains('empty-detail')) screen_main.classList.add('class-empty-detail');
	
	if (nextSummary.classList.contains('the-last-sentence')) {
		uncovering_button.classList.add('hide');
		showing_fullText_button.classList.remove('hide');
	}
}

// show the detail paragraph of the summary sentence which was clicked before.
function letsRewind( _nextSummary ) {
	var prevSummary = document.getElementsByClassName("focused-sentence")[0];
	var nextSummary = _nextSummary;
	var prevDetail = document.getElementsByClassName("shown-detail")[0];
	var nextDetail = match_detailArticle( nextSummary );
	var nextPARTnumber = match_PARTnumber( nextSummary );
	var nextPARTclass = "class-part-" + nextPARTnumber;
	
	prevSummary.classList.remove('focused-sentence');
	nextSummary.classList.add('focused-sentence');
	
	prevDetail.classList.remove('shown-detail');
	nextDetail.classList.add('shown-detail');
	screen_detail.scrollTo(0,0);
	
	screen_main.classList.remove('class-part-1', 'class-part-2', 'class-part-3', 'class-empty-detail');
	screen_main.classList.add(nextPARTclass);
	if (nextDetail.classList.contains('empty-detail')) screen_main.classList.add('class-empty-detail');
}

// show #fullText article.
function letsShowFulltext() {
	screen_summary.classList.add('hide');
	screen_detail.classList.add('hide');
	screen_fullText.classList.remove('hide');
}
// hide #fullText article.
function letsHideFulltext() {
	screen_fullText.classList.add('hide');
	screen_summary.classList.remove('hide');
	screen_detail.classList.remove('hide');
}


/* ------- module function ------ */


// Get an '(uncovered) summary sentence' element as an input. 
// ("section#summary-sentences > section > h2, section#summary-sentences > section > p > span")? 
// ("section#summary-sentences > section > p > span")? 
// Return a 'detail section' that matches with the input element. ("section#detail-articles > section.detail-bigSection > article.detail-bySentence")
function match_detailArticle( _summaryEle ) {
	
	var wholeSummary = $("section#summary-sentences > section > p > span"); 
	var wholeDetail = $("section#detail-paragraphs > section.detail-bigSection > section.detail-bySentence");
	var index = wholeSummary.index( _summaryEle );
	return wholeDetail[index];
}

function match_PARTnumber( _summaryEle ) {
	var wholeSummarySection = $("section#summary-sentences > section"); 
	return wholeSummarySection.index( _summaryEle.parentElement.parentElement ) + 1;
}



/* ------- DOMContentLoaded ------ */

// Handler when the DOM is fully loaded. Add the 'click' eventListener for executing letsRewind() fuction.
document.addEventListener("DOMContentLoaded", function(){
	document.getElementsByClassName("focused-sentence")[0].addEventListener('click', function(event) {
		var targetElement = event.target;
		letsRewind( targetElement ); 
	});
});