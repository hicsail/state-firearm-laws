var data = $.getJSON("js/glossary.json", function (obj) {

  // retrieve data
  data = obj['rows'];
  var categories = obj['categories'];
  var subcategories = obj['subcategories'];

  var headers = ["Code", "Definition", "Category"];


//Generate table header section
  var tableContent = "";
  tableContent += "<table class='table table-responsive table-hover'><thead><tr>";

  for (var i = 0; i < headers.length; i++) {
    tableContent += "<th>" + headers[i] + "</th>";
  }
  tableContent += "</tr></thead><tbody class='list'>";


//Generate all table rows from the glossary codebook

  for (var i = 0; i < data.length; i++) {
    var glossaryData = data[i]
    tableContent += "<tr>";
    tableContent += "<td class='variable'><i>" + glossaryData['variable'] + "</i></td>";
    tableContent += "<td class='description'>" + glossaryData['description'] + "</td>";
    tableContent += "<td class='category'>" + glossaryData['category'] + "<br>" + glossaryData['subcategory'] + "</td>";
    tableContent += "</tr>";
  }

  tableContent += "</tbody></table>"


//js-generated table is appended to div
  $('#glossary_table').append(tableContent);

  // create category dropdown menu
  var categoryContent = "<select class='selectpicker' title='Category' id='category_menu'>";

  for (var i = 0; i < categories.length; i++) {
    categoryContent += "<option class='categoryOption'>" + categories[i] + "</option>";
  }

  categoryContent += "</select>"

  $('#category_menu_placeholder').append(categoryContent);


  // create subcategory dropdown menu

  var subcategoryContent = "<select class='selectpicker' title='Subcategory' id='subcategory_menu'>";

  for (var i = 0; i < subcategories.length; i++) {
    subcategoryContent += "<option class='categoryOption'" + subcategories[i] + "'>" + subcategories[i] + "</option>";
  }

  subcategoryContent += "</select>";

  $('#subcategory_menu_placeholder').append(subcategoryContent);


  // create new List using list.js for manipulating the glossary table and dropdowns
  var glossaryOptions = {
    valueNames: ["variable", "description", "category"]
  };
  var glossaryList = new List('glossary_table', glossaryOptions);

  // change both dropdown menus on search event
  $('#glossary_search').keyup(function () {
    updateCategory(categories, glossaryList, false);
    updateCategory(subcategories, glossaryList, true);

  });

  // changes table based on category filter
  $('#category_menu').on('changed.bs.select',
    function (event, clickedIndex, newValue, oldValue) {

      // option from category menu
      var categoryOption = $('#category_menu option:selected').text();

      // update glossary table
      glossaryList.filter(function (item) {
        // from table, includes category and subcategory
        var tableCategory = item.values().category;
        tableCategory = tableCategory.slice(0, tableCategory.indexOf("<br>"));

        return (tableCategory === categoryOption && item.visible());
      });

      // update subcategory dropdown
      updateCategory(subcategories, glossaryList, true);

    });


  // changes table based on subcategory filter
  $('#subcategory_menu').on('changed.bs.select',
    function (event, clickedIndex, newValue, oldValue) {

      // option from category menu
      var categoryOption = $('#subcategory_menu option:selected').text();

      glossaryList.filter(function (item) {
        // from table, includes category and subcategory
        var tableCategory = item.values().category;
        tableCategory = tableCategory.slice(tableCategory.indexOf("<br>") + 4);

        return (tableCategory === categoryOption && item.visible());
      });

      // update subcategory dropdown
      updateCategory(categories, glossaryList, false);

    });

  // reset search settings to show complete glossary, empty search
  $('#reset_search').click(function () {
    glossaryList.search(); // resets table
    glossaryList.filter();
    $('#glossary_search').val(""); // resets searchbar


    // to do, reset category dropdowns
    resetCategoryDropdown(categories);
    resetSubcategoryDropdown(subcategories);
  });

});

// initializes dropdowns

function resetCategoryDropdown(categories) {
  // create category dropdown menu
  var categoryContent = "";

  for (var i = 0; i < categories.length; i++) {
    categoryContent += "<option class='categoryOption'>" + categories[i] + "</option>";
  }

  $('#category_menu').empty();
  $('#category_menu').append(categoryContent);
  $('#category_menu').selectpicker('refresh');
}

function resetSubcategoryDropdown(categories) {
  // create category dropdown menu

  for (var i = 0; i < categories.length; i++) {
    categoryContent += "<option class='categoryOption'" + categories[i] + "'>" + categories[i] + "</option>";
  }
}

// function that updates category/subcategory dropdown
function updateCategory(categoryList, glossaryList, isSubcategory) {
  var categoryContent = "";
  var categoryID;

  if (isSubcategory) {
    categoryID = '#subcategory_menu';
  } else {
    categoryID = '#category_menu';
  }


  // assume all categories hidden by default
  var isShow = [];
  $(categoryID).empty();
  categoryList.forEach(function (element) {
    isShow.push(false);
  });

  // find list of categories
  var visibleArray = glossaryList.visibleItems;

  for (var v in visibleArray) {
    // get category or subcategory for each table entry
    var tableCategory = visibleArray[v].values().category;
    if (tableCategory !== null) {
      if (isSubcategory) {
        tableCategory = tableCategory.slice(tableCategory.indexOf("<br>") + 4);
      } else {
        tableCategory = tableCategory.slice(0, tableCategory.indexOf("<br>"));
      }

      // loops through category for each table entry
      // if match, show category


      for (var i = 0; i < categoryList.length; i++) {
        if (isShow[i]) {
          continue;
        }
        if (categoryList[i] === tableCategory) {
          isShow[i] = true;
          categoryContent += "<option class='categoryOption'>" + categoryList[i] + "</option>";
        }
      }
    }

  }

  if (isSubcategory) {
    $('#subcategory_menu').append(categoryContent);
    $('#subcategory_menu').selectpicker('refresh');
  } else {
    $('#category_menu').append(categoryContent);
    $('#category_menu').selectpicker('refresh');
  }

}




