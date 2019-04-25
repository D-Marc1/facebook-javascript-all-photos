/**
 * Class to simplify getting all Facebook albums and photos and albums using Facebook API.
 */

class FbAllPhotos {

	/**
	 * Create empty object.
	 * @example
	 * const fbAllPhotos = new FbAllPhotos();
	 */
	constructor() {
		this.fullObj = {};
		this.errorObj = {};
		this.profilePictureURL = '';
	}

	/**
	 * Get Facebook profile picture.
	 *
	 * @fulfil {string} - The url of the Facebook profile picture
	 * @reject {Error} - Rejected promise with message.
	 * @example
	 * fbAllPhotos.getProfilePicture()
	 *   .then(profilePictureURL => { console.log(profilePictureURL); })
	 *   .catch(errorMsg => {
	 *     if(errorMsg === 'fbError') {
	 *       console.log(fbAllPhotos.errorObj.message);
	 *     } else if(errorMsg === 'noProfilePicture') {
	 *       console.log('No profile picture');
	 *     }
   *   });
	 */
	getProfilePicture() {
		return new Promise((resolve, reject) => {
			let errorReturnMsg = '';

			this.errorObj = {}; //Reset error object

			if(this.profilePictureURL) resolve(this.profilePictureURL); //If already set

			FB.api('/me?fields=picture.height(9999)', async response => { //Arbitrarily large number for largest pic
				if(response && response.error) { //If response exists and error
					errorReturnMsg = 'fbError';
					this.errorObj = response.error;
				} else if(!response || !response.hasOwnProperty('picture') || response.picture.data.is_silhouette) { //No picture
					errorReturnMsg = 'noProfilePicture';
				} else { //No errors
					this.profilePictureURL = response.picture.data.url;
					resolve(this.profilePictureURL);
				}

				if(errorReturnMsg) reject(errorReturnMsg); //Return error message if error
			});
		});
	}

	/**
	 * Get Facebook albums.
	 *
	 * @param {int} [limitAlbums = 25] - The number of albums to retrieve.
	 * @fulfil {object} - The full Facebook albums and photos object.
	 * @reject {Error} - Rejected promise with message.
	 * @example
	 * fbAllPhotos.getAlbums(15)
	 *   .then(fullObj => { console.log(fullObj); })
	 *   .catch(errorMsg => {
	 *     if(errorMsg === 'fbError') {
	 *       console.log(fbAllPhotos.errorObj.message);
	 *     } else if(errorMsg === 'noAlbums') {
	 *       console.log('No albums');
	 *     }
   *   });
	 */
	getAlbums(limitAlbums = 25) {
		return new Promise((resolve, reject) => {
			let errorReturnMsg = '';

			this.errorObj = {}; //Reset error object

			FB.api('/me?fields=albums.limit(' + limitAlbums + '){name,count,cover_photo{picture}}', response => {
				if(response && response.error) { //If response exists and error
					errorReturnMsg = 'fbError';
					this.errorObj = response.error;
				} else if(!response || !response.hasOwnProperty('albums')) {
					errorReturnMsg = 'noAlbums';
				} else { //No errors
					response.albums.data.forEach(album => {
						album.cover_photo = (album.cover_photo) ? album.cover_photo.picture : ''; //All we need is picture
					});

					this.fullObj = response.albums;
					resolve(this.fullObj);
				}

				if(errorReturnMsg) reject(errorReturnMsg); //Return error message if error
			});
		});
	}

	/**
	 * Get Facebook photos in a specified album.
	 *
	 * @param {int} albumId - The album id to get photos from.
	 * @param {int} [limitPhotos = 25] - The number of photos in an album to retrieve.
	 * @fulfil {object} - Object with only specified album and its photos.
	 * @reject {Error} - Rejected promise with message.
	 * @example
	 * const albumId = 8395830308572754;
	 *
	 * fbAllPhotos.getPhotosInAlbum(albumId, 15)
	 *   .then(albumObj => { console.log(albumObj); })
	 *   .catch(errorMsg => {
	 *     if(errorMsg === 'fbError') {
	 *       console.log(fbAllPhotos.errorObj.message);
	 *     } else if(errorMsg === 'noAlbum') {
	 *       console.log('Album does not exist');
	 *     } else if(errorMsg === 'noPhotos') {
	 *       console.log('No photos in album');
	 *     }
   *   });
	 */
	getPhotosInAlbum(albumId, limitPhotos = 25) {
		return new Promise((resolve, reject) => {
			let errorReturnMsg = '';

			this.errorObj = {}; //Reset error object

			const index = this.fullObj.data.findIndex(album => album.id == albumId); //Get index of album. Loose checking due to id as string

			if(index === -1) { //Album specified not in object
				reject('noAlbum');
			} else if(this.fullObj.data[index].hasOwnProperty('photos')) { //album already retrieved
				resolve(this.fullObj.data[index].photos);
			}

			FB.api(albumId + '/?fields=photos.limit(' + limitPhotos + '){picture,images}', response => {
				if(response && response.error) { //If response exists and error
					errorReturnMsg = 'fbError';
					this.errorObj = response.error;
				} else if(!response || !response.hasOwnProperty('photos')) { //No photos
					errorReturnMsg = 'noPhotos';
				} else { //No errors
					response.photos.data.forEach(photo => {
						photo.picture_full = photo.images[0].source; //[0] is the largest image
						delete photo.images; //Only need one full image
					});

					this.fullObj.data[index].photos = response.photos;
					resolve(this.fullObj.data[index].photos);
				}

				if(errorReturnMsg) reject(errorReturnMsg); //Return error message if error
			});
		});
	}

	/**
	 * Get more Facebook albums.
	 *
	 * @param {int} albumId - The album id to get photos from.
	 * @param {int} [limitPhotos = 25] - The number of photos in an album to retrieve.
	 * @fulfil {object} - The full Facebook albums and photos object.
	 * @reject {Error} - Rejected promise with message.
	 * @example
	 * fbAllPhotos.getMoreAlbums()
	 *   .then(fullObj => { console.log(fullObj); })
	 *   .catch(errorMsg => {
	 *     if(errorMsg === 'fbError') {
	 *       console.log(fbAllPhotos.errorObj.message); //Error message from Facebook
	 *     } else if(errorMsg === 'serverError') {
	 *       console.log(fbAllPhotos.errorObj); //Fetch API response object
	 *     } else if(errorMsg === 'noMore') {
	 *       console.log('No more albums to retrieve');
	 *     }
   *   });
	 */
	async getMoreAlbums() {
		let errorReturnMsg = '';

		this.errorObj = {}; //Reset error object

		if(!this.fullObj.paging.hasOwnProperty('next')) { //If there are no more albums
			errorReturnMsg = 'noMore';
		}

		const response = await fetch(this.fullObj.paging.next);

		if(!response.ok) {
			errorReturnMsg = 'serverError'; //If server error
			this.errorObj = response;
		} else {
			response = await response.json();

			if(response && response.error) {
				errorReturnMsg = 'fbError';
				this.errorObj = response.error;
			} else if(!response || !response.hasOwnProperty('data')) { //If no response or data. Likely redundant due to check of next
				errorReturnMsg = 'noMore';
			} else { //No errors
				response.data.forEach(album => {
					album.cover_photo = (album.cover_photo) ? album.cover_photo.picture : ''; //All we need is picture
				});

				this.fullObj.data.push(...response.data); //Append albums
				this.fullObj.paging = response.paging; //Set paging to new values
			}
		}

		if(errorReturnMsg) throw errorReturnMsg; //Return error message if error

		return this.fullObj;
	}

	/**
	 * Get more Facebook photos in a specified album.
	 *
	 * @param {int} albumId - The album id to get more photos from.
	 * @fulfil {object} - Object with only specified album and its photos.
	 * @reject {Error} - Rejected promise with message.
	 * @example
	 * const albumId = 8395830308572754;
	 *
	 * fbAllPhotos.getMorePhotosInAlbum(albumId)
	 *   .then(albumObj => { console.log(albumObj); })
	 *   .catch(errorMsg => {
	 *     if(errorMsg === 'fbError') {
	 *       console.log(fbAllPhotos.errorObj.message); //Error message from Facebook
	 *     } else if(errorMsg === 'serverError') {
	 *       console.log(fbAllPhotos.errorObj); //Fetch API response object
	 *     } else if(errorMsg === 'noAlbum') {
	 *       console.log('Album does not exist');
	 *     } else if(errorMsg === 'noMore') {
	 *       console.log('No more photos in album to retrieve');
	 *     }
   *   });
	 */
	async getMorePhotosInAlbum(albumId) {
		let errorReturnMsg = '';

		this.errorObj = {}; //Reset error object

		const index = this.fullObj.data.findIndex(album => album.id == albumId); //Get index of album. Loose checking due to id as string

		if(index === -1) { //If album doesn't exist
			throw 'noAlbum';
		} else if(!this.fullObj.data[index].photos.paging.hasOwnProperty('next')) { //If there are no more photos in specific album
			throw 'noMore';
		}

		const response = await fetch(this.fullObj.paging.next);

		if(!response.ok) {
			errorReturnMsg = 'serverError'; //If server error
			this.errorObj = response;
		} else {
			response = await response.json();

			if(response && response.error) { //If response exists and error
				errorReturnMsg = 'fbError';
				this.errorObj = response.error;
			} else if(!response || !response.hasOwnProperty('data')) { //If no response or data. Likely redundant due to check of album existence and next
				errorReturnMsg = 'noMore';
			} else { //No errors
				response.data.forEach(photo => {
					photo.picture_full = photo.images[0].source; //[0] is the largest image
					delete photo.images; //Don't need the rest, only one
				});

				this.fullObj.data[index].photos.data.push(...response.data); //Append photos in album
				this.fullObj.data[index].photos.paging = response.paging; //Set paging to new values
			}
		}

		if(errorReturnMsg) throw errorReturnMsg; //Return error message if error

		return this.fullObj.data[index].photos;
	}
}