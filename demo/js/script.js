let currentAlbum;
const pageLoaded = {fbAlbums: false, fbPhotos: false};

const fbAllPhotos = new FbAllPhotos();

const app = new Framework7({
	root: '#app',
	name: 'Get all Facebook Album Photos',
	routes: [
		{
			path: '/',
			url: 'index.html'
		},
		{
			path: '/fb-albums/',
			async: async (routeTo, routeFrom, resolve, reject) => {
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
					getDataTemplate(fbAllPhotos.fullObj);
				} else {
					try {
						getDataTemplate(await fbAllPhotos.getAlbums(7));
						pageLoaded.fbAlbums = true;
					} catch(errorMsg) {
						let userMsg = '';

						if(errorMsg === 'fbError') {
							userMsg = fbAllPhotos.errorObj.message;
						} else if(errorMsg === 'noAlbums') {
							userMsg = 'No albums';
						}

						app.dialog.alert('', userMsg);
					}
				}
			}
		},
		{
			path: '/fb-photos/',
			async: async (routeTo, routeFrom, resolve, reject) => {
				try {
					const photosObj = await fbAllPhotos.getPhotosInAlbum(currentAlbum, 5);

					resolve(
						{
							templateUrl: 'fb-photos.html'
						},
						{
							context: {
								photos: photosObj.data,
								album_id: photosObj.data.id,
								album_name: photosObj.data.name
							}
						}
					);

					pageLoaded.fbPhotos = true;
				} catch(errorMsg) {
					let userMsg;

					if(errorMsg === 'fbError') {
						userMsg = fbAllPhotos.errorObj.message;
					} else if(errorMsg === 'noAlbum') {
						userMsg = 'Album does not exist';
					} else if(errorMsg === 'noPhotos') {
						userMsg = 'No photos';
					}

					app.dialog.alert('', userMsg);
					reject();
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

				$$('#load-more-albums-link').click(async function() {
					try {
						await fbAllPhotos.getMoreAlbums();

						mainView.router.refreshPage();
					} catch(errorMsg) {
						let userMsg;

						if(errorMsg === 'fbError') {
							userMsg = fbAllPhotos.errorObj.message;
						} else if(errorMsg === 'serverError') {
							userMsg = 'Server error';
						} else if(response === 'noMore') {
							userMsg = 'No more albums to retrieve';
						}

						app.dialog.alert('', userMsg);
					}
				});
			} else if(page.name === 'fb-photos') {
				$$('#load-more-photos-link').click(async function() {
					currentAlbum = $$(this).data('album-id');

					try {
						await fbAllPhotos.getMorePhotosInAlbum(currentAlbum);

						mainView.router.refreshPage();
					} catch(errorMsg) {
						let userMsg;

						if(errorMsg === 'fbError') {
							userMsg = fbAllPhotos.errorObj.message;
						} else if(errorMsg === 'serverError') {
							userMsg = 'Server error';
						} else if(errorMsg === 'noMore') {
							userMsg = 'No more photos in album to retrieve';
						} else if(errorMsg === 'noAlbum') {
							userMsg = 'Album does not exist';
						}

						app.dialog.alert('', userMsg);
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

const $$ = Dom7;

const mainView = app.views.create('.view-main', {
	url: '/',
	stackPages: true
});

$$('.page-current').hide();
app.dialog.preloader('Loading Facebook JavaScript SDK');