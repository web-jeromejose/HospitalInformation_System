var PagePos= 1;
var NoOfRows = 0;

var grdFrac = {
    divId: null,
    grid: null,
    MaximumScroll: 0,
    selectPageUrl: null,
    SetIncremetal: function () {
        var ScrollH = $(window).height();
        this.grid.SetFocusedRowIndex(1);
        this.grid.SetVerticalScrollPosition(ScrollH);
        this.MaximumScroll = this.grid.GetVerticalScrollPosition();
        this.grid.SetFocusedRowIndex(1);
        this.grid.SetVerticalScrollPosition(20);

        if (this.MaximumScroll == 0)
            return;

        this.SetScrollEvent(this.grid, this.MaximumScroll, this.selectPageUrl);
    },
    SetDecremental: function () {
        this.grid.SetFocusedRowIndex(NoOfRows - 1);
        this.grid.SetVerticalScrollPosition(this.MaximumScroll - 20);

        if (this.MaximumScroll == 0)
            return;

        this.SetScrollEvent(this.grid, this.MaximumScroll, this.selectPageUrl);
    },
    SetScrollEvent: function (s, MaximumScroll, url) {
        var gf = this;
        ASPxClientUtils.AttachEventToElement(s.GetMainElement(), "scroll", function (event) {
            var scrollPos = s.GetVerticalScrollPosition();
            if (scrollPos == MaximumScroll) {
                PagePos++;
                url = url + PagePos;
                $("#" + gf.divId).load(url, function () {
                    gf.SetIncremetal();
                });
            }
            else if (scrollPos == 0) {
                if (PagePos > 1) {
                    PagePos--;
                    url = url + PagePos;
                    $("#" + gf.divId).load(url, function () {
                        gf.SetDecremental();
                    });
                }
            }
        });
    }

};
