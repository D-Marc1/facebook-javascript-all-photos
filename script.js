let currentAlbum;
let pageLoaded = {fbAlbums: false, fbPhotos: false};

let fb = new FbAllPhotos();

let app = new Framework7({
  root: '#app',
  name: 'Get all Facebook Album Photos',
  routes: [
    {
      path: '/',
      url: 'index.html'
    },
    {
      path: '/fb-albums/',
      async: (routeTo, routeFrom, resolve, reject) => {
        function getDataTemplate(response) {
          resolve(
            {
              templateUrl: 'fb-albums.html'
            },
            {
              context: {
                albums: response.data
              }
            }
          );
        }

        if(pageLoaded.fbAlbums) { //If page already loaded
          getDataTemplate(fb.fullObj);
        } else {
          fb.getAlbums(5, response => {
            getDataTemplate(response);
            pageLoaded.fbAlbums = true;
          }, response => {
            var userMsg;

            if(response === 'error') {
              userMsg = 'Error getting albums';
            } else if(response === 'noResponse') {
              userMsg = 'No albums';
            }

            app.dialog.alert('', userMsg);
          });
        }
      }
    },
    {
      path: '/fb-photos/',
      async: (routeTo, routeFrom, resolve, reject) => {
        const index = fb.fullObj.data.findIndex(album => album.id == currentAlbum); //get index of album

        if(index === -1) {
          app.dialog.alert('', 'Album does not exist');
          return;
        }

        function getDataTemplate(response) {
          resolve(
            {
              templateUrl: 'fb-photos.html'
            },
            {
              context: {
                photos: response.data,
                album_id: fb.fullObj.data[index].id,
                album_name: fb.fullObj.data[index].name
              }
            }
          );
        }

        if(pageLoaded.fbPhotos && fb.fullObj.data[index].hasOwnProperty('photos')) { //If page already loaded and fb.getPhotosInAlbum() called for album
          getDataTemplate(fb.fullObj.data[index].photos);
        } else {
          fb.getPhotosInAlbum(currentAlbum, 5, response => {
            getDataTemplate(response);
            pageLoaded.fbPhotos = true;
          }, response => {
            var userMsg;

            if(response === 'error') {
              userMsg = 'Error getting photos';
            } else if(response === 'noResponse') {
              userMsg = 'No photos';
            } else if(response === 'noAlbum') {
              userMsg = 'Album does not exist';
            }

            app.dialog.alert('', userMsg);
            reject();
          });
        }
      }
    }
  ],
  on: {
    pageInit: page => {
      if(page.name === 'index') {
         $$('#log-in-out-fb-link').click(function() {
           const $this = $$(this);
           const currStatus = $this.data('status');
           let setStatus, setText, setAnchorText, setStatusColor, setBtnColor; //status and btn color are opposites

           function setNewVals() {
             $$('#log-in-out-text').text(setText)
              .removeClass('text-color-' + setBtnColor)
              .addClass('text-color-' + setStatusColor);
             $this.text(setAnchorText)
              .attr('data-status', setStatus)
              .removeClass('color-' + setStatusColor)
              .addClass('color-' + setBtnColor);
           }

           //set to opposite
           if(currStatus === 'in') { //logging in
             setText = 'logged out';
             setAnchorText = 'Login';
             setStatus = 'out';
             setStatusColor = 'red';
             setBtnColor = 'green';

             FB.logout(response => {
               setNewVals();
             });
           } else { //logging out
             setText = 'logged in';
             setAnchorText = 'Logout';
             setStatus = 'in';
             setStatusColor = 'green';
             setBtnColor = 'red';

             FB.login(response => {
              if(response.authResponse) setNewVals();
              else app.dialog.alert('', 'User cancelled authorization');
             }, {scope: 'user_photos'});
           }
         });
      } else if(page.name === 'fb-albums') {
        $$('.album-thumb-link').click(function() {
          currentAlbum = $$(this).attr('data-album-id');
          mainView.router.navigate('/fb-photos/');
        });

        $$('#load-more-albums-link').click(function() {
          fb.getMoreAlbums(response => {
            mainView.router.refreshPage();
          }, response => {
            var userMsg;

            if(response === 'error') {
              userMsg = 'Error getting more albums';
            } else if(response === 'noMore') {
              userMsg = 'No more albums';
            }

            app.dialog.alert('', userMsg);
          });
        });
      } else if(page.name === 'fb-photos') {
        $$('#load-more-photos-link').click(function() {
          currentAlbum = $$(this).data('album-id');
          const index = fb.fullObj.data.findIndex(album => album.id == currentAlbum); //get index of album

          if(index === -1) {
            app.dialog.alert('', 'Album does not exist');
            return;
          }

          if(fb.fullObj.data[index].photos.paging.hasOwnProperty('next')) {
            fb.getMorePhotosInAlbum(currentAlbum, response => {
              mainView.router.refreshPage();
            }, response => {
              //the only error needed to handle, due to if check above to check object's next prop
              app.dialog.alert('', 'Error getting more photos');
            });
          } else {
            app.dialog.alert('', 'No more photos in album');
          }
        });

        $$('.photo-thumb-link').click(function() {
          const photoUrl = $$(this).data('full-photo-url');

          app.photoBrowser.create({
            photos : [photoUrl],
            theme: 'dark',
            toolbar: false
          }).open();
        });
      }
    }
  }
});

let $$ = Dom7;

let mainView = app.views.create('.view-main', {
  url: '/',
  stackPages: true
});

$$('.page-current').hide();
app.dialog.preloader('Loading Facebook JavaScript SDK');