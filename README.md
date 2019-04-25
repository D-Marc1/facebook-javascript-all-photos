# Facebook API JavaScript SDK get all Albums and Photos

![](https://s3.amazonaws.com/websitebeaver/blog/facebook-api-javascript-sdk-get-all-albums-and-photos/main.jpg)

A simple demo of how to use the Facebook API with the JavaScript SDK to get all of your albums and photos. Luckily the [Cordova Facebook plugin](https://github.com/jeduan/cordova-plugin-facebook4) is pretty similar to it also.

A full writeup can be found here https://websitebeaver.com/facebook-api-javascript-sdk-get-all-albums-and-photos, along with a [demo video](https://www.youtube.com/watch?v=s8kasi_8nIo).

# How to Use?

Firstly, you must get approved by [approved by Facebook](https://developers.facebook.com/docs/facebook-login/review/how-to-submit) to use `user_photos` permissions.

Once you're aproved, you just need to change the `appId` property on `FB.init()`, which is located in **index.html**.

```javascript
FB.init({
  appId            : ENTER APP ID HERE,
  autoLogAppEvents : true,
  xfbml            : true,
  version          : 'v3.0'
});
```

# Just Using the Functions

<a name="FbAllPhotos"></a>

## FbAllPhotos
Class to simplify getting all Facebook albums and photos and albums using Facebook API.

**Kind**: global class  

* [FbAllPhotos](#FbAllPhotos)
    * [new FbAllPhotos()](#new_FbAllPhotos_new)
    * [.getProfilePicture()](#FbAllPhotos+getProfilePicture)
    * [.getAlbums([limitAlbums])](#FbAllPhotos+getAlbums)
    * [.getPhotosInAlbum(albumId, [limitPhotos])](#FbAllPhotos+getPhotosInAlbum)
    * [.getMoreAlbums(albumId, [limitPhotos])](#FbAllPhotos+getMoreAlbums)
    * [.getMorePhotosInAlbum(albumId)](#FbAllPhotos+getMorePhotosInAlbum)

<a name="new_FbAllPhotos_new"></a>

### new FbAllPhotos()
Create empty object.

**Example**  
```js
const fbAllPhotos = new FbAllPhotos();
```

<a name="FbAllPhotos+getProfilePicture"></a>

### fbAllPhotos.getProfilePicture()
Get Facebook profile picture.

**Kind**: instance method of [<code>FbAllPhotos</code>](#FbAllPhotos)  
**Fulfil**: <code>string</code> - The url of the Facebook profile picture  
**Reject**: <code>Error</code> - Rejected promise with message.  
**Example**  
```js
fbAllPhotos.getProfilePicture()
  .then(profilePictureURL => { console.log(profilePictureURL); })
  .catch(errorMsg => {
    if(errorMsg === 'fbError') {
      console.log(fbAllPhotos.errorObj.message);
    } else if(errorMsg === 'noProfilePicture') {
      console.log('No profile picture');
    }
  });
```
<a name="FbAllPhotos+getAlbums"></a>

### fbAllPhotos.getAlbums([limitAlbums])
Get Facebook albums.

**Kind**: instance method of [<code>FbAllPhotos</code>](#FbAllPhotos)  
**Fulfil**: <code>object</code> - The full Facebook albums and photos object.  
**Reject**: <code>Error</code> - Rejected promise with message.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [limitAlbums] | <code>int</code> | <code>25</code> | The number of albums to retrieve. |

**Example**  
```js
fbAllPhotos.getAlbums(15)
  .then(fullObj => { console.log(fullObj); })
  .catch(errorMsg => {
    if(errorMsg === 'fbError') {
      console.log(fbAllPhotos.errorObj.message);
    } else if(errorMsg === 'noAlbums') {
      console.log('No albums');
    }
  });
```
<a name="FbAllPhotos+getPhotosInAlbum"></a>

### fbAllPhotos.getPhotosInAlbum(albumId, [limitPhotos])
Get Facebook photos in a specified album.

**Kind**: instance method of [<code>FbAllPhotos</code>](#FbAllPhotos)  
**Fulfil**: <code>object</code> - Object with only specified album and its photos.  
**Reject**: <code>Error</code> - Rejected promise with message.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| albumId | <code>int</code> |  | The album id to get photos from. |
| [limitPhotos] | <code>int</code> | <code>25</code> | The number of photos in an album to retrieve. |

**Example**  
```js
const albumId = 8395830308572754;

fbAllPhotos.getPhotosInAlbum(albumId, 15)
  .then(albumObj => { console.log(albumObj); })
  .catch(errorMsg => {
    if(errorMsg === 'fbError') {
      console.log(fbAllPhotos.errorObj.message);
    } else if(errorMsg === 'noAlbum') {
      console.log('Album does not exist');
    } else if(errorMsg === 'noPhotos') {
      console.log('No photos in album');
    }
  });
```
<a name="FbAllPhotos+getMoreAlbums"></a>

### fbAllPhotos.getMoreAlbums(albumId, [limitPhotos])
Get more Facebook albums.

**Kind**: instance method of [<code>FbAllPhotos</code>](#FbAllPhotos)  
**Fulfil**: <code>object</code> - The full Facebook albums and photos object.  
**Reject**: <code>Error</code> - Rejected promise with message.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| albumId | <code>int</code> |  | The album id to get photos from. |
| [limitPhotos] | <code>int</code> | <code>25</code> | The number of photos in an album to retrieve. |

**Example**  
```js
fbAllPhotos.getMoreAlbums()
  .then(fullObj => { console.log(fullObj); })
  .catch(errorMsg => {
    if(errorMsg === 'fbError') {
      console.log(fbAllPhotos.errorObj.message); //Error message from Facebook
    } else if(errorMsg === 'serverError') {
      console.log(fbAllPhotos.errorObj); //Fetch API response object
    } else if(errorMsg === 'noMore') {
      console.log('No more albums to retrieve');
    }
  });
```
<a name="FbAllPhotos+getMorePhotosInAlbum"></a>

### fbAllPhotos.getMorePhotosInAlbum(albumId)
Get more Facebook photos in a specified album.

**Kind**: instance method of [<code>FbAllPhotos</code>](#FbAllPhotos)  
**Fulfil**: <code>object</code> - Object with only specified album and its photos.  
**Reject**: <code>Error</code> - Rejected promise with message.  

| Param | Type | Description |
| --- | --- | --- |
| albumId | <code>int</code> | The album id to get more photos from. |

**Example**  
```js
const albumId = 8395830308572754;

fbAllPhotos.getMorePhotosInAlbum(albumId)
  .then(albumObj => { console.log(albumObj); })
  .catch(errorMsg => {
    if(errorMsg === 'fbError') {
      console.log(fbAllPhotos.errorObj.message); //Error message from Facebook
    } else if(errorMsg === 'serverError') {
      console.log(fbAllPhotos.errorObj); //Fetch API response object
    } else if(errorMsg === 'noAlbum') {
      console.log('Album does not exist');
    } else if(errorMsg === 'noMore') {
      console.log('No more photos in album to retrieve');
    }
  });
```