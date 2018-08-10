class FbAllPhotos {
  constructor() {
    this.fbAlbumsPhotosObj = {};
  }

  get fullObj() {
    return this.fbAlbumsPhotosObj
  }

  getAlbums(limitAlbums = 5, winCallback, failCallback) {
    FB.api('/me?fields=albums.limit(' + limitAlbums + '){name,count,cover_photo{picture}}', response => {
      if(response.error) {
        if(typeof failCallback === 'function') failCallback('error');
        return;
      } else if(!response || !response.hasOwnProperty('albums')) {
        if(typeof failCallback === 'function') failCallback('noResponse');
        return;
      }

      response.albums.data.forEach(album => {
        album.cover_photo = album.cover_photo.picture; //All we need is picture
      });

      this.fbAlbumsPhotosObj = response.albums;

      if(typeof winCallback === 'function') winCallback(this.fbAlbumsPhotosObj);
    });
  }

  getPhotosInAlbum(albumId, limitPics = 10, winCallback, failCallback) {
    const index = this.fbAlbumsPhotosObj.data.findIndex(album => album.id == albumId); //Get index of album

    if(index === -1) {
      if(typeof failCallback === 'function') failCallback('noAlbum');
      return;
    }

    FB.api(albumId + '/?fields=photos.limit(' + limitPics + '){picture,images}', response => {
      if(!response || response.error) {
        if(typeof failCallback === 'function') failCallback('error');
        return;
      } else if(!response || !response.hasOwnProperty('photos')) {
        if(typeof failCallback === 'function') failCallback('noResponse');
        return;
      }

      response.photos.data.forEach(photo => {
        photo.picture_full = photo.images[0].source; //[0] is the largest image
        delete photo.images; //Only need one full image
      });

      this.fbAlbumsPhotosObj.data[index].photos = response.photos;

      if(typeof winCallback === 'function') winCallback(this.fbAlbumsPhotosObj.data[index].photos);
    });
  }

  getMoreAlbums(winCallback, failCallback) {
    if(!this.fbAlbumsPhotosObj.paging.hasOwnProperty('next')) { //If there are no more albums
      if(typeof failCallback === 'function') failCallback('noMore');
      return;
    }

    app.request.json(this.fbAlbumsPhotosObj.paging.next, response => {
      response.data.forEach(album => {
        album.cover_photo = album.cover_photo.picture; //All we need is picture
      });

      this.fbAlbumsPhotosObj.data.push(...response.data); //Append albums
      this.fbAlbumsPhotosObj.paging = response.paging; //Set paging to new values

      if(typeof winCallback === 'function') winCallback(this.fbAlbumsPhotosObj);
    }, () => {
      if(typeof failCallback === 'function') failCallback('error');
    });
  }

  getMorePhotosInAlbum(albumId, winCallback, failCallback) {
    const index = this.fbAlbumsPhotosObj.data.findIndex(album => album.id == albumId); //Get index of album

    if(index === -1) {
      if(typeof failCallback === 'function') failCallback('noAlbum');
      return;
    } else if(!this.fbAlbumsPhotosObj.data[index].photos.paging.hasOwnProperty('next')) { //If there are no more albums
      if(typeof failCallback === 'function') failCallback('noMore');
      return;
    }
    
    app.request.json(this.fbAlbumsPhotosObj.data[index].photos.paging.next, response => {
      response.data.forEach(photo => {
        photo.picture_full = photo.images[0].source; //[0] is the largest image
        delete photo.images; //Don't need the rest, only one
      });

      this.fbAlbumsPhotosObj.data[index].photos.data.push(...response.data); //Append photos in album
      this.fbAlbumsPhotosObj.data[index].photos.paging = response.paging; //Set paging to new values

      if(typeof winCallback === 'function') winCallback(this.fbAlbumsPhotosObj.data[index].photos);
    }, () => {
      if(typeof failCallback === 'function') failCallback('error');
    });
  }
}