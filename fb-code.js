let fbAlbumsPhotosObj = {};

function getFbAlbums(limitAlbums = 5, winCallback, failCallback) {
  FB.api('/me?fields=albums.limit(' + limitAlbums + '){name,count,cover_photo{picture}}', response => {
    if(response.error) {
      if(typeof failCallback === 'function') failCallback('error');
    } else if(!response) {
      if(typeof failCallback === 'function') failCallback('noResponse');
    } else {
      response.albums.data.forEach(album => {
        album.cover_photo = album.cover_photo.picture; //All we need is picture
      });

      fbAlbumsPhotosObj = response.albums;

      if(typeof winCallback === 'function') winCallback(fbAlbumsPhotosObj);
    }
  });
}

function getFbPhotosInAlbum(albumId, limitPics = 10, winCallback, failCallback) {
  const index = fbAlbumsPhotosObj.data.findIndex(album => album.id === albumId); //Get index of album

  if(index === -1) {
    if(typeof failCallback === 'function') failCallback('noAlbum');
    return;
  }

  FB.api(albumId + '/?fields=photos.limit(' + limitPics + '){picture,images}', response => {
    if(!response || response.error) {
      if(typeof failCallback === 'function') failCallback('error');
    } else if(!response) {
      if(typeof failCallback === 'function') failCallback('noResponse');
    } else {
      response.photos.data.forEach(photo => {
        photo.picture_full = photo.images[0].source; //[0] is the largest image
        delete photo.images; //Only need one full image
      });

      fbAlbumsPhotosObj.data[index].photos = response.photos;

      if(typeof winCallback === 'function') winCallback(fbAlbumsPhotosObj.data[index].photos);
    }
  });
}

function getMoreFbAlbums(winCallback, failCallback) {
  if(!fbAlbumsPhotosObj.paging.hasOwnProperty('next')) { //If there are no more albums
    if(typeof failCallback === 'function') failCallback('noMore');
  } else {
    app.request.json(fbAlbumsPhotosObj.paging.next, response => {
      response.data.forEach(album => {
        album.cover_photo = album.cover_photo.picture; //All we need is picture
      });

      fbAlbumsPhotosObj.data.push(...response.data); //Append albums
      fbAlbumsPhotosObj.paging = response.paging; //Set paging to new values

      if(typeof winCallback === 'function') winCallback(fbAlbumsPhotosObj);
    }, () => {
      if(typeof failCallback === 'function') failCallback('error');
    });
  }
}

function getMoreFbPhotosInAlbum(albumId, winCallback, failCallback) {
  const index = fbAlbumsPhotosObj.data.findIndex(album => album.id === albumId); //Get index of album

  if(index === -1) {
    if(typeof failCallback === 'function') failCallback('noAlbum');
    return;
  } else if(!fbAlbumsPhotosObj.data[index].photos.paging.hasOwnProperty('next')) { //If there are no more albums
    if(typeof failCallback === 'function') failCallback('noMore');
  } else {
    app.request.json(fbAlbumsPhotosObj.data[index].photos.paging.next, response => {
      response.data.forEach(photo => {
        photo.picture_full = photo.images[0].source; //[0] is the largest image
        delete photo.images; //Don't need the rest, only one
      });

      fbAlbumsPhotosObj.data[index].photos.data.push(...response.data); //Append photos in album
      fbAlbumsPhotosObj.data[index].photos.paging = response.paging; //Set paging to new values

      if(typeof winCallback === 'function') winCallback(fbAlbumsPhotosObj.data[index].photos);
    }, () => {
      if(typeof failCallback === 'function') failCallback('error');
    });
  }
}