angular.module('fluro').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('definition-field-render/definition-field-render.html',
    "<div class=\"definition-field-render form-group\"><label ng-if=\"field.type != 'group'\">{{field.title}}</label><div field-transclude></div></div>"
  );


  $templateCache.put('definition-field-render/field-types/multiple-value.html',
    "<div ng-switch=field.type><div class=content-select ng-switch-when=reference><div class=\"content-list list-group\"><div class=\"list-group-item clearfix\" ng-repeat=\"item in model[field.key]\"><div class=pull-left ng-click=viewInModal(item)><img ng-if=\"item._type == 'image'\" ng-src=\"{{$root.getThumbnailUrl(item._id)}}\"> <i ng-if=\"item._type != 'image'\" class=\"fa fa-{{item._type}}\"></i> <span>{{item.title}}</span></div><div class=\"actions pull-right btn-group\"><a class=\"btn btn-tiny btn-xs\" ng-if=\"item.assetType == 'upload'\" target=_blank ng-href={{$root.getDownloadUrl(item._id)}}><i class=\"fa fa-download\"></i></a> <a class=\"btn btn-tiny btn-xs\" ng-if=canEdit(item) ng-click=editInModal(item)><i class=\"fa fa-edit\"></i></a></div></div></div></div><div ng-switch-default><ul><li ng-repeat=\"value in model[field.key]\">{{value}}</li></ul></div></div>"
  );


  $templateCache.put('definition-field-render/field-types/value.html',
    "<div ng-switch=field.type><div class=content-select ng-switch-when=reference><div class=\"content-list list-group\"><div class=\"list-group-item clearfix\" ng-init=\"item = model[field.key]\"><div class=pull-left ng-click=viewInModal(item)><img ng-if=\"item._type == 'image'\" ng-src=\"{{$root.getThumbnailUrl(item._id)}}\"> <i ng-if=\"item._type != 'image'\" class=\"fa fa-{{item._type}}\"></i> <span>{{item.title}}</span></div><div class=\"actions pull-right btn-group\"><a class=\"btn btn-tiny btn-xs\" ng-if=\"item.assetType == 'upload'\" target=_blank ng-href={{$root.getDownloadUrl(item._id)}}><i class=\"fa fa-download\"></i></a> <a class=\"btn btn-tiny btn-xs\" ng-if=canEdit(item) ng-click=editInModal(item)><i class=\"fa fa-edit\"></i></a></div></div></div></div><div ng-switch-default>{{model[field.key]}}</div></div>"
  );


  $templateCache.put('routes/home/home.html',
    "<div class=home><div class=wrapper><div class=container><h1>Hi {{user.firstName}}</h1><p class=lead>You're ready to start coding!</p></div></div></div>"
  );

}]);
