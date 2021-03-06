window.onload = function () {
    if (localStorage.userType === undefined || !(localStorage.userType === 'Player' || localStorage.userType === 'Pro'))
        window.location.href = '/'
}

//Submits a new video to the server
$('#sendVideo').click(function (evt) {
    evt.preventDefault();
    $(this).prop('disabled', true);
    $(this).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Uploading...')

    var data = new FormData($("#formFile")[0]);
    data.append('UserID', localStorage.userID)
    $.ajax({
        url: "/api/users/:id/videos",
        method: "post",
        data: data,
        processData: false,
        contentType: false,
        success: function (res, status) {
            console.log(res)
            if (res.status && res.dbStatus) {
                $(this).prop('disabled', false);
                $(this).html('Upload')
                alert('File Uploaded successfully')
                window.location.href = 'profile'

            }
            else alert('Error Uploading File - Please try again later')
        }

        , error: function () { alert(JSON.stringify('error')); }

    });
})

function getVideoName() {
    $('#videoLabel').text($('#video')[0].files[0].name)
}