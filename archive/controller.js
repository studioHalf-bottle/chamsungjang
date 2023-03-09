var screen_main = document.getElementsByTagName("main")[0];
var screen_posting_list = document.getElementById("posting-list");
var screen_detail_articles = document.getElementById("detail-articles");

var postList_fromJSON = new Array(); 


/* ------- bulid initial list of posts ------ */
function return_postList_fromJSON( _json ) {
	let array_input = _json; 
	let array_output = new Array(); 
	
	array_input.forEach( function( _categoryEle ) {
		_categoryEle.post_list.forEach( function( _postEle ) {
			_postEle.category = _categoryEle.category; 
			_postEle.category_KR = _categoryEle.category_KR; 
			_postEle.category_class = _categoryEle.category_class; 
			array_output.push(_postEle);
		});
	});
	
	array_output.sort( function( a, b ) {
		return new Date(a.publishingDate).getTime() - new Date(b.publishingDate).getTime(); 
	});
	return array_output;
}


function build_archiveMenu_left() {
	var head_domElement, metadata_domElement, date_domElement, category_domElement, publisher_domElement, title_domElement; 
	
	postList_fromJSON.forEach( function( _postEle ) {
		
		postTime = new Date(_postEle.publishingDate);
		date_domElement = document.createElement("date"); 
		date_domElement.appendChild( document.createTextNode(`${postTime.getFullYear()}. ${postTime.getMonth()+1}. ${postTime.getDate()} - `) );
		category_domElement = document.createElement("span"); 
		category_domElement.classList.add( "posting-category" );
		category_domElement.appendChild( document.createTextNode(`${_postEle.category_KR}, `) );
		publisher_domElement = document.createElement("span"); 
		publisher_domElement.classList.add( "posting-publisher" );
		publisher_domElement.appendChild( document.createTextNode(`${_postEle.publisher}`) );
		
		metadata_domElement = document.createElement("div");
		metadata_domElement.classList.add( "posting-metadata" );
		metadata_domElement.append(date_domElement, category_domElement, publisher_domElement);
		
		title_domElement = document.createElement("h2"); 
		title_domElement.classList.add( "posting-title" );
		title_domElement.appendChild( document.createTextNode(`${_postEle.title}`) );
		
		head_domElement = document.createElement("section"); 
		head_domElement.classList.add( "posting-head", _postEle.category_class ); 
		head_domElement.append( metadata_domElement, title_domElement );
		
		screen_posting_list.appendChild(head_domElement); 
		
	});
	
}


function build_detailArticles_right() {
	var domParser = new DOMParser();
	var domDoc_fromParser; 
	var article_domElement, metadata_domElement, date_domElement, category_domElement, publisher_domElement, title_domElement; 
	var nav01_domElement, nav02_domElement;
	var p_domElement_array, p_caption_domElement; 
	var image_video_domElement;
	
	postList_fromJSON.forEach( function( _postEle ) {
		
		postTime = new Date(_postEle.publishingDate);
		date_domElement = document.createElement("date"); 
		date_domElement.appendChild( document.createTextNode(`${postTime.getFullYear()}. ${postTime.getMonth()+1}. ${postTime.getDate()} `) );
		category_domElement = document.createElement("span"); 
		category_domElement.classList.add( "posting-category" );
		category_domElement.appendChild( document.createTextNode(`${_postEle.category_KR}, `) );
		publisher_domElement = document.createElement("span"); 
		publisher_domElement.classList.add( "posting-publisher" );
		publisher_domElement.appendChild( document.createTextNode(`${_postEle.publisher}`) );
		
		metadata_domElement = document.createElement("div");
		metadata_domElement.classList.add( "posting-metadata" );
		metadata_domElement.append(date_domElement, document.createElement("br"), category_domElement, publisher_domElement);
		
		title_domElement = document.createElement("h2"); 
		title_domElement.classList.add( "posting-title" );
		title_domElement.appendChild( document.createTextNode(`${_postEle.title}`) );
		
		
		if (_postEle.hyperlink_01) {
			nav01_domElement = document.createElement("nav"); 
			domDoc_fromParser = domParser.parseFromString(`<a href="${_postEle.hyperlink_01}" target="_blank">${_postEle.hyperlink_01_desc} →</a>`, "text/html");
			nav01_domElement.classList.add( "posting-relatedLink" );
			nav01_domElement.appendChild( domDoc_fromParser.body.firstChild );
		}
		if (_postEle.hyperlink_02) {
			nav02_domElement = document.createElement("nav"); 
			domDoc_fromParser = domParser.parseFromString(`<a href="${_postEle.hyperlink_02}" target="_blank">${_postEle.hyperlink_02_desc} →</a>`, "text/html");
			nav02_domElement.classList.add( "posting-relatedLink" );
			nav02_domElement.appendChild( domDoc_fromParser.body.firstChild );
		}
		
		p_domElement_array = new Array();
		_postEle.html_p_list.forEach( function( _pEle ) {
			domDoc_fromParser = domParser.parseFromString(`<p>${_pEle}</p>`, "text/html");
			p_domElement_array.push( domDoc_fromParser.body.firstChild );
		})
		
		if (_postEle.html_p_caption) {
//			p_caption_domElement = document.createElement("p"); 
//			domDoc_fromParser = domParser.parseFromString(`${_postEle.html_p_caption}`, "text/html");
//			p_caption_domElement.classList.add( "posting-caption" );
//			p_caption_domElement.appendChild( domDoc_fromParser.body.firstChild );
			p_caption_domElement = domParser.parseFromString(`<p class="posting-caption">${_postEle.html_p_caption}</p>`, "text/html")
																			.body.firstChild;
		}
		
		if (_postEle.html_image_video) {
			if (_postEle.html_image_video.slice(0, 30) == "https://www.youtube.com/embed/") // YouTube Video
				domDoc_fromParser = domParser.parseFromString(
					`<div class="iframe-container">
							<iframe loading="lazy" width="560" height="315" src="${_postEle.html_image_video}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
					</div>`
					, "text/html");
			else // image
				domDoc_fromParser = domParser.parseFromString(
					`<img src="${_postEle.html_image_video}" alt="" loading="lazy" />`
					, "text/html");
			image_video_domElement = document.createElement("figure");
			image_video_domElement.appendChild( domDoc_fromParser.body.firstChild );
		}
		
		
		article_domElement = document.createElement("article"); 
		article_domElement.classList.add( "posting-article", _postEle.category_class );
		article_domElement.append( metadata_domElement, title_domElement );
		if (_postEle.hyperlink_01) article_domElement.appendChild( nav01_domElement );
		if (_postEle.hyperlink_02) article_domElement.appendChild( nav02_domElement );
		article_domElement.append( ...p_domElement_array ); 
		if (_postEle.html_p_caption) article_domElement.appendChild( p_caption_domElement );
		if (_postEle.html_image_video) article_domElement.appendChild( image_video_domElement );
		
		
		screen_detail_articles.appendChild( article_domElement ); 
	});
	
}


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
	screen_detail_articles.scrollTo(0,0);
	
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






/* ------- initial JSON fetch & DOMContentLoaded ------ */


// Handler when the DOM is fully loaded, do this.
document.addEventListener("DOMContentLoaded", function(){
// Handler when every resource is fully loaded, do this.
//document.addEventListener("load", function(){
	var postingHead_collection = document.getElementsByClassName("posting-head");
	var filterButton_collection = document.getElementsByClassName("category-filter-button");
	var closeButton = document.getElementById("hiding-detail-article-button");
	
	// call the JSON file("archive-post-list.json"), parse it, rearrange it and assign it into variable "postList_fromJSON". 
	fetch('../@asset/archive-post-list.json')
			.then((response) => {
					if (!response.ok) {
						throw new Error('네트워크 응답이 올바르지 않습니다.');
					}
					return response.json(); 
			})
			.then(function(_json) { 
					postList_fromJSON = return_postList_fromJSON(_json);
					build_archiveMenu_left(); 
					build_detailArticles_right();
			})
			.then(function() { 
					for(let i=0; i<postingHead_collection.length; i++){
						postingHead_collection[i].addEventListener('click', function(event) {
							var targetElement = $(event.target).closest(".posting-head")[0];
							letsShowThePosting( targetElement ); 
						});
					}
			})
			.catch((error) => {
					console.error('fetch에 문제가 있었습니다.', error);
			});
	
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