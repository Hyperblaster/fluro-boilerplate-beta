var app = angular.module('fluro', [
    'ngAnimate',
    'ngResource',
    'ui.router',
    'ngTouch',
    'fluro.config',
    'fluro.content',
    'fluro.asset',
])



/////////////////////////////////////////////////////////////////////

function getMetaKey(stringKey) {
    var metas = document.getElementsByTagName('meta');

    for (i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute("property") == stringKey) {
            return metas[i].getAttribute("content");
        }
    }
    return "";
}


/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

app.config(function($stateProvider, $httpProvider, FluroProvider, $urlRouterProvider, $locationProvider) {

    ///////////////////////////////////////////////////

    var access_token = getMetaKey('fluro_application_key');

    //API URL
    var api_url = getMetaKey('fluro_url');

    FluroProvider.set({
        apiURL: api_url,
        token: access_token,
        sessionStorage: true,
    });

    ///////////////////////////////////////////

    //Http Intercpetor to check auth failures for xhr requests
    if (!access_token) {
        $httpProvider.defaults.withCredentials = true;
    }

    $httpProvider.interceptors.push('FluroAuthentication');

    ///////////////////////////////////////////

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("/");

    ///////////////////////////////////////////
    ///////////////////////////////////////////

    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'routes/home/home.html',
        controller: 'HomeController',
        resolve: {
            session: function($stateParams, FluroContent) {
                return FluroContent.endpoint('session').get().$promise;
            }
        }
    });

    ///////////////////////////////////////////

    $urlRouterProvider.otherwise("/");


});

/////////////////////////////////////////////////////////////////////


app.run(function($rootScope, Asset, $state) {

    $rootScope.asset = Asset;
    $rootScope.$state = $state;

    //////////////////////////////////////////////////////////////////

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        throw error;
    });


    //////////////////////////////////////////////////////

    //Make touch devices more responsive
    FastClick.attach(document.body);

});