function ViewModel(SummaryOfAccounts, elem) {
    model = SummaryOfAccounts
    self = this;
    self.inputUrlActions = elem;
    self.StartDate = ko.observable(new Date(moment(model.StartDate)));
    self.StartDateExcel = ko.observable(new Date(moment(model.StartDateExcel)));
    self.EndDateExcel = ko.observable(new Date(moment(model.EndDateExcel)));
    self.EndDate = ko.observable(new Date(moment(model.EndDate)));

    self.CategoryList = ko.observableArray(model.CategoryList);
    self.CategoryListExcel = ko.observableArray(model.CategoryListExcel);
    self.SubCategoryList = ko.observableArray(model.SubCategoryList);
    self.SubCategoryListExcel = ko.observableArray(model.SubCategoryListExcel);
    self.CompanyList = ko.observableArray([]);
    self.CompanyListExcel = ko.observableArray([]);
    self.GradeList = ko.observableArray([]);
    self.GradeListExcel = ko.observableArray([]);
    
    self.Type = ko.observable(model.Type)
    self.TypeExcel = ko.observable(model.TypeExcel)
    self.BankDetails = ko.observable(model.BankDetails)
    console.log('model.AfterCoveringLetter' + model.AfterCoveringLetter);
    console.log(  model);
    self.AfterCoveringLetter = ko.observable(model.AfterCoveringLetter)
    self.AfterCoveringLetterExcel = ko.observable(model.AfterCoveringLetterExcel)

    self.SelectedCategory = ko.observable(self.CategoryList()[0].Id);
   
    self.SelectedCategoryText = ko.observable(self.CategoryList()[0].Name);
    self.SelectedSubCategory = ko.observable(0);
    self.SelectedSubCategoryExcel = ko.observable(0);
    self.SelectedSubCategoryText = ko.observable('ALL');
    self.SelectedCompany = ko.observable();
    self.SelectedCompanyExcel = ko.observable();
    self.SelectedGrade = ko.observable();
    self.SelectedGradeExcel = ko.observable();
    
    self.init = function () {
        self.SubCategoryList().unshift({ Id: 0, Name: 'ALL' });
        self.SubCategoryListExcel().unshift({ Id: 0, Name: 'ALL' });
        self.getCompanyByCategory();
      
        self.GradeList.push({ Id: 0, Name: "ALL" });
        self.GradeListExcel.push({ Id: 0, Name: "ALL" });
    }

    self.getCompanyByCategory = function () {
        self.CompanyList([]);
      
        url = self.inputUrlActions.data("getcompanybycategory");
     
        param = { categoryId: self.SelectedCategory()};

        ajaxWrapper.GetWithLoading(url, param, $("#s2id_CompanyId"), function (data, e) {
            var defaultValue = { Id: 0, Code: "", Name: "ALL" };
            self.CompanyList.push(defaultValue);
            for (i = 0; i < data.length; i++) {
                self.CompanyList.push({ Id: data[i].Id, Code: data[i].Code, Name: data[i].Name });
            };
        });
    }
 


    

    self.getGradeByCompanyId = function () {

        var testt = self.SelectedCompany();
        if (self.SelectedCompany() != undefined) {
            self.GradeList.removeAll();
            url = self.inputUrlActions.data("getgradebycompanyid");
            var id = self.SelectedCompany().Id;
            param = { companyId: id };

            ajaxWrapper.GetWithLoading(url, param, $("#s2id_GradeId"), function (data, e) {
              
                var defaultValue = { Id: 0, Name: "ALL" };

                ko.utils.arrayPushAll(self.GradeList, data);
                self.GradeList.unshift(defaultValue);
                self.SelectedGrade(0);
            });
        }
    }

    self.getGradeByCompanyIdExcel = function () {

        var testt = self.SelectedCompanyExcel();
        if (self.SelectedCompanyExcel() != undefined) {
            self.GradeListExcel.removeAll();
            url = self.inputUrlActions.data("getgradebycompanyid");
            var id = self.SelectedCompanyExcel().Id;
            param = { companyId: id };

            ajaxWrapper.GetWithLoading(url, param, $("#s2id_GradeIdExcel"), function (data, e) {

                var defaultValue = { Id: 0, Name: "ALL" };

                ko.utils.arrayPushAll(self.GradeListExcel, data);
                self.GradeListExcel.unshift(defaultValue);
                self.SelectedGradeExcel(0);
            });
        }
    }

    self.init();

    self.SelectedCategory.subscribe(function (newValue) {
        self.getCompanyByCategory();
        if (newValue) {
            $.each(self.CategoryList(), function (i, item) {
                if (item.Id == newValue) {
                    self.SelectedCategoryText(item.Name);
                }
            });
        }
    });

   

    
    
    self.SelectedCompany.subscribe(function () {
        self.getGradeByCompanyId();
    });
    self.SelectedCompanyExcel.subscribe(function () {
        self.getGradeByCompanyIdExcel();
    });

    self.SelectedSubCategory.subscribe(function (newValue) {
       
        if (newValue) {
            $.each(self.SubCategoryList(), function (i, item) {
                if (item.Id === newValue) {
                    self.SelectedSubCategoryText(item.Name);
                }
            });
        } else {
            self.SelectedSubCategoryText("ALL");
        }

    });

    self.EnableType = function () {

        return true;
        //if (self.SelectedCategory() == 23 || self.SelectedCategory() == 24 || self.SelectedCategory() == 70) {
        //    return true;
        //} else {
        //    return false;
        //}
    };
    self.EnableTypeExcel = function () {

        return true;
        //if (self.SelectedCategory() == 23 || self.SelectedCategory() == 24 || self.SelectedCategory() == 70) {
        //    return true;
        //} else {
        //    return false;
        //}
    };
}