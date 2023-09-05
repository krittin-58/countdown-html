// Local Storage for Smart TV
if (typeof localStorage == "undefined" && typeof FileSystem == "function") {
    var fileSyObj = new FileSystem();
    var fileName  = curWidget.id + "_localStorage.db";
    var lStorage  = {};
    var changed   = false;
    
    // load or init localStorage file
    var fileObj = fileSyObj.openCommonFile(fileName, "r+");
    if (fileObj != null) {
        try {
            lStorage = JSON.parse(fileObj.readAll());
        } catch(e) { }
    } else {
        fileObj = fileSyObj.openCommonFile(fileName, "w")
        fileObj.writeAll("{}");
    }
    fileSyObj.closeCommonFile(fileObj);
    
    // Save storage
    lStorage.saveFile = function(delay) {
        if (changed && typeof JSON == 'object') {
            var $self = this;
            var save  = function() {
                fileObj = fileSyObj.openCommonFile(fileName, "w")
                fileObj.writeAll(JSON.stringify($self));
                fileSyObj.closeCommonFile(fileObj);
                changed = false;
            }
            if (typeof delay != 'undefined' && delay)
                setTimeout(save, 100);
            else
                save();
        }
    }

    lStorage.setItem = function(key, value) {
        changed = true;
        this[key] = value.toString();
        this.saveFile(true);
        return this[key];
    }
    
    lStorage.getItem = function(key) {
        return this[key];
    }
    
    window.localStorage = lStorage;
}