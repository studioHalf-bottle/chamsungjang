var screen_main = document.getElementsByTagName("main")[0];
var screen_posting_menu = document.getElementById("posting-menu");
var screen_detail = document.getElementById("detail-articles");

var uncovering_button = document.getElementById("uncovering-button");
var showing_fullText_button = document.getElementById("showing-fullText-button");
var hiding_fullText_button = document.getElementById("hiding-fullText-button");


/* ------- main UI/UX functions ------ */

// show the detail article of the clicked posting (head).
function letsShowThePosting( _nextHead ) {
	var prevHead = document.getElementsByClassName("focused-head")[0];
	var nextHead = _nextHead;
	var prevDetail = document.getElementsByClassName("shown-detail")[0];
	var nextDetail = match_detailPosting( nextHead );
	var nextCategoryClass = 'main-posting-category-' + matchHEAD_CATEGORY( nextHead );
	
	if (prevHead != undefined) prevHead.classList.remove('focused-head');
	nextHead.classList.add('focused-head');
	
	if (prevDetail != undefined) prevDetail.classList.remove('shown-detail');
	nextDetail.classList.add('shown-detail');
	screen_detail.scrollTo(0,0);
	
	screen_main.classList.remove('main-posting-category-data', 'main-posting-category-video', 'main-posting-category-paper', 'main-posting-category-blog', 'main-posting-category-press', 'main-empty-detail');
	screen_main.classList.add(nextCategoryClass);
	if (nextDetail.classList.contains('empty-detail')) screen_main.classList.add('main-empty-detail');
}


// show/hide(filter/unfilter) posting-heads by clicking category-filter-button
function filteringCategory( _clickedButton ) {
	var filterButton_collection = document.getElementsByClassName("category-filter-button");
	var filterButton_elementALL = document.getElementById("category-filter-button-all");
	var postingHead_collection = document.getElementsByClassName("posting-head");
	var clickedCategory = matchFILTER_CATEGORY( _clickedButton );
	var clickedCategory_head = 'posting-category-' + clickedCategory;
	
	if (clickedCategory == "all") {
		for(let i=0; i<postingHead_collection.length; i++){
			postingHead_collection[i].classList.remove('filtered');
		}
		for(let i=0; i<filterButton_collection.length; i++){
			filterButton_collection[i].classList.remove('selected-category-filter');
		}
		filterButton_elementALL.classList.add('selected-category-filter');
	}
	
	else {
		if (filterButton_elementALL.classList.contains('selected-category-filter')) {
			for(let i=0; i<postingHead_collection.length; i++){
				postingHead_collection[i].classList.add('filtered');
			}
			filterButton_elementALL.classList.remove('selected-category-filter');
		}
		
		for(let i=0; i<postingHead_collection.length; i++){
			if ( postingHead_collection[i].classList.contains(clickedCategory_head) ) postingHead_collection[i].classList.toggle('filtered');
		}
		_clickedButton.classList.toggle('selected-category-filter');
	}	
}

function letsHideDetailArticle() {
	if (document.getElementsByClassName("focused-head").length > 0) {
		document.getElementsByClassName("focused-head")[0].classList.remove("focused-head");
		document.getElementsByClassName("shown-detail")[0].classList.remove("shown-detail");
		screen_main.classList.remove('main-posting-category-data', 'main-posting-category-video', 'main-posting-category-paper', 'main-posting-category-blog', 'main-posting-category-press', 'main-empty-detail');
	}
}



/* ------- module function ------ */


// Get an 'posting head' element as an input. 
// Return a 'detail posting article' that matches with the input element. ("div#detail-articles > article.posting-article")
function match_detailPosting( _headEle ) {
	var wholeHead = $("div#posting-list > section.posting-head"); 
	var wholeDetail = $("div#detail-articles > article.posting-article");
	var index = wholeHead.index( _headEle );
	return wholeDetail[index];
}
	
function matchFILTER_CATEGORY( _filterButtonEle ) {
	var filterButtonCATEGORYid = _filterButtonEle.id;
	return filterButtonCATEGORYid.split('-')[3];
}

function matchHEAD_CATEGORY( _headEle ) {
	var headCATEGORYclass = _headEle.classList[1]; 
	return headCATEGORYclass.split('-')[2];
}



/* ------- DOMContentLoaded ------ */

// Handler when the DOM is fully loaded, do this.
document.addEventListener("DOMContentLoaded", function(){
	var postingHead_collection = document.getElementsByClassName("posting-head");
	var filterButton_collection = document.getElementsByClassName("category-filter-button");
	var closeButton = document.getElementById("hiding-detail-article-button");
	
	for(let i=0; i<postingHead_collection.length; i++){
		postingHead_collection[i].addEventListener('click', function(event) {
			var targetElement = $(event.target).closest(".posting-head")[0];
			letsShowThePosting( targetElement ); 
		});
	}
	for(let i=0; i<filterButton_collection.length; i++){
		filterButton_collection[i].addEventListener('click', function(event) {
			var targetElement = $(event.target).closest(".category-filter-button")[0];
			filteringCategory( targetElement ); 
		});
	}
	closeButton.addEventListener('click', function(event) {
		var targetElement = $(event.target);
		letsHideDetailArticle( targetElement ); 
	});
});