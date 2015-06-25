var starnav = require('./templates/starnav.hbs');
var navdropdown = require('./templates/navdropdown.hbs');
var rootCategoryBadge = require('./templates/rootCategoryBadge.hbs');
var categoryBadge = require('./templates/categoryBadge.hbs');
var categoryStars = require('./templates/categoryStars.hbs');
var categoryAPO = require('./templates/categoryAPO.hbs');
var tellUsImg = require('./templates/tellus.hbs');
var questionImg = require('./templates/questionImg.hbs');
var _ = require('lodash');
var $ = require('jquery');

var mockData = {
    products : [
        {
            productId : '179565',
            productName : 'PROTO',
            productPage : '/catalog/product.jsp?selectedColor=BEIGE-SNAKE&amp;parentCategoryId=0&amp;categoryId=2163&amp;quantity=1&amp;productVariantId=848265&amp;productId=179565&amp;isFreeProductItem=false&amp;deliveryMethod=buyOnline',
            productImage : 'https://s7d9.scene7.com/is/image/SteveMadden/STEVEMADDEN-DRESS_PROTO_BEIGE-SNAKE_SIDE?$MR%2DTHUMB2$',
            questionText : 'Does the Sole Have any Cushioning?',
            color : 'BEIGE SNAKE',
            size : '6',                    
            rating : 5,
            rootCategory : 'womens',
            category : 'pumps'                      
        },
        {
            productId : '179311',
            productName : 'VINCIBLE',
            productPage : '/catalog/product.jsp?selectedColor=FLORAL-MULTI&amp;parentCategoryId=0&amp;categoryId=2163&amp;quantity=1&amp;productVariantId=803157&amp;productId=179311&amp;isFreeProductItem=false&amp;deliveryMethod=buyOnline',
            productImage : 'https://s7d9.scene7.com/is/image/SteveMadden/STEVEMADDEN-DRESS_VINCIBLE_FLORAL-MULTI_SIDE?$MR%2DTHUMB2$',
            color : 'FLORAL MULTI',
            size : '5.5',            
            rating : 5,
            rootCategory : 'womens',
            category : 'pumps'          
        }
    ]
};

require('./styles/navdropdown.css');
require('./styles/categorybadge.css');
require('./styles/categorypage.css');

function PostInteractionNotification (config, apiconfig) {      
    this.config = config;
    this.apiconfig = apiconfig;
    this.navInjectionZone = document.querySelector('#' + config.navInjectionZone);
    this.navHoverBound = this.navHover.bind(this);
    this.closeButtonBound = this.closeDropdown.bind(this);
    this.boundSubmitAnswer = this.submitAnswer.bind(this);
    this.boundStarHover = this.starHover.bind(this);
    this.navInjectionZone.addEventListener('mouseover', this.navHoverBound, false);
    this.data = {
        products : config.productData
    };
    this.categoryCounts = {};
    this.rootCategoryCounts = {};
    this.data.products.forEach(function (product) {                
        product.ratingRange = _.range(5);                         
        this.rootCategoryCounts[product.rootCategory] = this.rootCategoryCounts[product.rootCategory] || 0;
        this.rootCategoryCounts[product.rootCategory]++;
        this.categoryCounts[product.category] = this.categoryCounts[product.category] || 0;
        this.categoryCounts[product.category]++;                
    }.bind(this));        
}

PostInteractionNotification.prototype.render = function render () {    
    this.navInjectionZone.innerHTML = starnav();    
    // Set up badges if present
    _.forEach(this.rootCategoryCounts, function (count, category) {
        var categoryLink = document.querySelector('#bv-category-' + category);
        if (categoryLink) {
            categoryLink.insertAdjacentHTML('beforebegin', rootCategoryBadge({ count : count }));
        } 
    });
    _.forEach(this.categoryCounts, function (count, category) {
        var categoryLink = document.querySelector('#bv-category-' + category);
        if (categoryLink) {
            categoryLink.insertAdjacentHTML('afterbegin', categoryBadge({ count : count }));
        } 
    });      
    this.data.products.forEach(function (product) {        
        var review = document.querySelector('#bv-recommended-review-' + product.productId);
        var apo = document.querySelector('#bv-recommended-apo-' + product.productId);
        if (review) {
            this.renderReviewProduct(review, product);
        }
        else if (apo) {
            this.renderAPOProduct(apo, product);
        }            
    }.bind(this));
    
    this.submitButtons = document.querySelectorAll('.bv-submit-button');
    _.forEach(this.submitButtons, function (button) {
        button.addEventListener('click', this.onSubmit.bind(this));
    }.bind(this));                 
};

PostInteractionNotification.prototype.navHover = function navHover () {
    var starParent;
    this.navInjectionZone.removeEventListener('mouseover', this.navHoverBound, false);      
    document.body.insertAdjacentHTML('beforeend', navdropdown(this.data));  
    this.navDropdown = document.querySelector('#widget-ucart.review-nav-dropdown');
    this.navSubmitButtons = this.navDropdown.querySelectorAll('.bv-submit-button');
    _.forEach(this.navSubmitButtons, function (button) {
        button.addEventListener('click', this.onSubmit.bind(this));
    }.bind(this));
    this.closeButton = this.navDropdown.querySelector('a.close');
    this.closeButton.addEventListener('click', this.closeButtonBound, false);
    _.forEach(this.navDropdown.querySelectorAll('.bv-star'), function (star) {
        starParent = starParent || star.parentElement;        
        star.addEventListener('mouseover', this.boundStarHover, false); 
        star.addEventListener('click', this.starClick.bind(this), false);
    }.bind(this));
    starParent.dataset.starrating = -1;     
    starParent.addEventListener('mouseout', function (e) {        
        var rating = starParent.dataset.starrating;
        _.forEach(starParent.querySelectorAll('.bv-star'), function (s) {
            if (s.dataset.star <= rating) {
                $(s).removeClass('bv-starempty');
                $(s).addClass('bv-starfull');
            }  
            else {
                $(s).addClass('bv-starempty');
                $(s).removeClass('bv-starfull');
            }
        }); 
    }, false);
};

PostInteractionNotification.prototype.onSubmit = function onSubmit (e) {    
    e.preventDefault();
    var productId = e.target.dataset.productid;    
    
    window.$BV.ui('rr', 'submit_review', {
        productId : productId,
    });
};

PostInteractionNotification.prototype.closeDropdown = function closeDropdown () {
    this.closeButton.removeEventListener('click', this.closeButtonBound, false);
    this.navInjectionZone.addEventListener('mouseover', this.navHoverBound, false);
    this.navDropdown = null;
    this.navSubmitButtons = null;
    this.closeButton = null;
};

PostInteractionNotification.prototype.renderReviewProduct = function renderReviewProduct (el, product) {
    $(el).addClass('bv-recommended-review');
    $(el).find('.item_wrap').append(categoryStars(product));
    $(el).find('.item_wrap').prepend(tellUsImg());
    var starParent;
        
    _.forEach(el.querySelectorAll('.bv-star'), function (star) {
        starParent = star.parentElement;
        star.addEventListener('mouseover', this.boundStarHover, false);
        star.addEventListener('click', this.starClick.bind(this), false);        
    }.bind(this));
    
    starParent.dataset.starrating = -1;     
    starParent.addEventListener('mouseout', function (e) {        
        var rating = starParent.dataset.starrating;        
        _.forEach(starParent.querySelectorAll('.bv-star'), function (s) {
            if (s.dataset.star <= rating) {
                $(s).removeClass('bv-starempty');
                $(s).addClass('bv-starfull');
            }  
            else {
                $(s).addClass('bv-starempty');
                $(s).removeClass('bv-starfull');
            }
        }); 
    }, false);
};

PostInteractionNotification.prototype.renderAPOProduct = function renderAPOProduct (el, product) {
    $(el).addClass('bv-recommended-apo');
    $(el).find('.item_wrap').append(categoryAPO(product));
    $(el).find('.item_wrap').prepend(questionImg());
    el.querySelector('.bv-submit-answer-button').addEventListener('click', this.boundSubmitAnswer, false);    
};

PostInteractionNotification.prototype.submitAnswer = function submitAnswer (e) {    
    e.preventDefault();
    var el = e.target;    
    el.removeEventListener('click', this.boundSubmitAnswer);
    el = el.parentElement.parentElement.parentElement;
    el.querySelector('.bv-question-field').style.visibility = 'hidden';
    el.querySelector('.bv-buttons').style.visibility = 'hidden';    
    el.querySelector('.bv-question').innerHTML = 'Thanks for your feedback!';
};

PostInteractionNotification.prototype.starHover = function starHover (e) {    
    var star = e.target;
    var rating = star.dataset.star;
    var stars = star.parentElement;   
    _.forEach(stars.querySelectorAll('.bv-star'), function (s) {
        if (s.dataset.star <= rating) {
            $(s).removeClass('bv-starempty');
            $(s).addClass('bv-starfull');
        }  
        else {
            $(s).addClass('bv-starempty');
            $(s).removeClass('bv-starfull');
        }
    });
};

PostInteractionNotification.prototype.starClick = function starClick(e) {
    var el = e.target;
    var stars = el.parentElement;
    stars.dataset.starrating = el.dataset.star;
};

module.exports = PostInteractionNotification;