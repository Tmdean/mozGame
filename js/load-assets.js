spcw.load_assets = function () {
    var assets, check_images_loaded, i;
    
    assets = [
        'png/Ship0.png', // 0
        'png/Ship1.png', // 1
        'png/Ship2.png', // 2
        'png/Ship3.png', // 3
        'png/Ship4.png', // 4
        'png/Ship5.png', // 5
        'png/Ship6.png', // 6
        'png/Ship7.png', // 7
        'png/Ship8.png', // 8
        'png/Ship9.png', // 9
        'png/Ship10.png', // 10
        'png/Ship11.png', // 11
        'png/Ship12.png', // 12
        'png/Ship13.png', // 13
        'png/Ship14.png', // 14
        'png/Ship15.png', // 15
        'png/Bullet.png', // 20
        'png/Explode1.png', // 21
        'png/Explode2.png', // 22
        'png/Planet.png', // 23
    ];
    
    spcw.asset_index = {
        SHIP_0: 0,
        SHIP_1: 1,
        SHIP_2: 2,
        SHIP_3: 3,
        SHIP_4: 4,
        SHIP_5: 5,
        SHIP_6: 6,
        SHIP_7: 7,
        SHIP_8: 8,
        SHIP_9: 9,
        SHIP_10: 10,
        SHIP_11: 11,
        SHIP_12: 12,
        SHIP_13: 13,
        SHIP_14: 14,
        SHIP_15: 15,
        BULLET: 16,
        EXPLODE_1: 17,
        EXPLODE_2: 18,
        PLANET: 19,
    };
    
    spcw.img_asset = [];
    
    spcw.assets_loaded = false;
    check_images_loaded = function () {
        var i, loaded;
        
        loaded = true;
        for (i = 0; i < spcw.img_asset.length; i++) {
            if (!spcw.img_asset[i].complete) {
                loaded = false;
                break;
            }
        }
        
        if (loaded) {
            spcw.assets_loaded = true;
        }
    };
    
    for (i = 0; i < assets.length; i++) {
        spcw.img_asset[i] = new Image();
        spcw.img_asset[i].src = assets[i];
        spcw.img_asset[i].onload = check_images_loaded;
    }
};
