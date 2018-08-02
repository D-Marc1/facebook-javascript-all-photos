# Facebook API JavaScript SDK get all Albums and Photos

![](https://s3.amazonaws.com/websitebeaver/blog/facebook-api-javascript-sdk-get-all-albums-and-photos/main.jpg)

A simple demo of how to use the Facebook API with the JavaScript SDK to get all of your albums and photos. Luckily the [Cordova Facebook plugin](https://github.com/jeduan/cordova-plugin-facebook4) is pretty similar to it also.

A full writeup can be found here https://websitebeaver.com/facebook-api-javascript-sdk-get-all-albums-and-photos, along with a [demo video](https://www.youtube.com/watch?v=s8kasi_8nIo).

## How to Use?

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