function pad2(number) {
    return (number < 10 ? '0' : '') + number;
}

function slugify(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
    var to   = "aaaaaeeeeeiiiiooooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
};

module.exports = {

    templateData : {

        site : {
            url : "http://axelhzf.com",
            oldUrls : [
                'www.website.com',
                'website.herokuapp.com'
            ],
            author : "Axel Hernández Ferrea",
            title : "axelhzf",
            description : "Axelhzf",
            keywords : "place, your, website, keywoards, here, keep, them, related, to, the, content, of, your, website"
        },
        getPreparedTitle : function () {
            if (this.document.title) {
                return this.document.title + " | " + this.site.title;
            } else {
                return this.site.title;
            }
        },
        getPreparedDescription : function () {
            return this.document.description || this.site.description;
        },

        getPreparedKeywords : function () {
            return this.site.keywords.concat(this.document.keywords || []).join(', ');
        },
        getTags : function (tags) {
            tags = tags || [];
            return tags.join(', ');
        },
        getComments : function () {
            var parameters = {
                disqusId : this.document.disqusId || this.site.url + this.document.url
            }
            return this.partial('comments.html.eco', parameters)
        }
    },
    collections : {
        posts : function (database) {
            return database.findAllLive({layout : 'post.html.eco'}, {date : -1});
        }
    }
}