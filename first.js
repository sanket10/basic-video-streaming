var ffmpeg = require('ffmpeg');

try {
    var process = new ffmpeg('deleteTeamActivity.wmv');
    process.then((video) => {
        console.log('The video is ready to be process');
    }).catch((err) => {
        console.log('Error : '+err);
    })
} catch (e) {
    console.log(e.code);
    console.log(e.msg);
}