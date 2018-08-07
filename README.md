# Facebook API JavaScript SDK get all Albums and Photos

![](https://s3.amazonaws.com/websitebeaver/blog/facebook-api-javascript-sdk-get-all-albums-and-photos/main.jpg)

A simple demo of how to use the Facebook API with the JavaScript SDK to get all of your albums and photos. Luckily the [Cordova Facebook plugin](https://github.com/jeduan/cordova-plugin-facebook4) is pretty similar to it also.

A full writeup can be found here https://websitebeaver.com/facebook-api-javascript-sdk-get-all-albums-and-photos, along with a [demo video](https://www.youtube.com/watch?v=s8kasi_8nIo).

# How to Use?

Firstly, you must get approved by [approved by Facebook](https://developers.facebook.com/docs/facebook-login/review/how-to-submit) to use `user_photos` permissions.

Once you're aproved, you just need to change the `addId` property on `FB.init()`, which is located in **index.html**.

```javascript
FB.init({
  appId            : ENTER APP ID HERE,
  autoLogAppEvents : true,
  xfbml            : true,
  version          : 'v3.0'
});
```

# Just Using the Functions

I made this in demo form for anyone to quickly get things workings. But if you'd like to just use the functions, then all you need is **fb-code.js**. You can obviously also use it as a starting point and edit each function to suit your needs. As shown in the tutorial, this will all be stored in an object called `fbAlbumsPhotosObj`. Additionally it'll be the response of `winCallback` for each function.


```javascript
function getFbAlbums(int limitAlbums = 5, function winCallback(obj response), function failCallback(string error))
```

**Description**

Get Facebook albums

**Parameters**

- **int limitAlbums** - The amount of albums to fetch at once
- **function winCallback(obj response)** - On success
- **function failCallback(string error)** - On failure

```javascript
function getFbPhotosInAlbum(int albumId, int limitPics = 10, function winCallback(obj response), function failCallback(string error))
```

**Description**

Get Facebook photos in an album

**Parameters**

- **int albumId** - The album id to get photos from
- **int limitAlbums** - The amount of photos to fetch at once
- **function winCallback(obj response)** - On success
- **function failCallback(string error)** - On failure

```javascript
function getMoreFbAlbums(function winCallback(obj response), function failCallback(string error))
```

**Description**

Get more Facebook albums until depletion

**Parameters**

- **function winCallback(obj response)** - On success
- **function failCallback(string error)** - On failure

```javascript
function getMoreFbPhotosInAlbum(albumId, function winCallback(obj response), function failCallback(string error))
```

**Description**

Get more Facebook photos in album until depletion

**Parameters**

- **int albumId** - The album id to get photos from
- **function winCallback(obj response)** - On success
- **function failCallback(string error)** - On failure
