var currentDate = new Date();

window.onload = function () {
    var pusername = document.getElementById("pusername"),
        pName = document.getElementById("pName"),
        pAge = document.getElementById("pAge"),
        pRegion = document.getElementById("pRegion"),
        pGame = document.getElementById("pGame"),
        pMainPos = document.getElementById("pMainPos"),
        pTeam = document.getElementById("pTeam"),
        pBio = document.getElementById("pBio");

        $.ajax({
            url: "/api/profile?id="+sessionStorage.userID,
            method: "get",
            dataType: "json",
            success: function (res, status) {
                if (res.err) return;
                
                var s = JSON.stringify(res);
                var data = JSON.parse(s); 
                
                pusername.innerHTML = data[0].username;
                pName.innerHTML += data[0].name;
                pAge.innerHTML += currentDate.getFullYear() - data[0].birthDate.substring(0, data[0].birthDate.length-20);
                pRegion.innerHTML += data[0].region;
                pGame.innerHTML += data[0].game;
                pMainPos.innerHTML += data[0].mainPosition;
                pTeam.innerHTML += data[0].teamName;
                pBio.innerHTML = data[0].bio;
            }
        })
}

