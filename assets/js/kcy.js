(function () {

    var Kcy = function (options) {
        this.options = options;
        this.$el = $(options.el);
    }

    Kcy.prototype = {

        url : function () {
            return "http://karmacracy.com/api/v1/user/" + this.options.user + "?kcy=1&num=6";
        },

        fetch : function () {
            $.get(this.url(), $.proxy(this._render, this));
        },

        _render : function (response) {
            console.log(response);
            var kcys = response.data.user[0].kcys;
            var html = '';
            $.each(kcys, function (idx, kcy) {
                console.log(kcy);
                html += '<div><a href="' + kcy.shorturl + '">' + kcy.title + '</a></div>';
            });
            this.$el.html(html);
        }
    }

    window.Kcy = Kcy;
}());