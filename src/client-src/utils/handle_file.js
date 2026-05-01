
class handle_file {

    async download(uri, filename) {

        return new Promise((res_cb, rej) => {
            try {
                window.request.head(uri, function (err, res, body) {
                    //todo: check content type to be valid
                    window.request(uri).pipe(window.fs.createWriteStream(filename)).on('close', () => {
                        res_cb(true)
                    });
                });
            } catch (err) {
                console.log("🚀 ~ file: handle_file.js ~ line 14 ~ handle_file ~ returnnewPromise ~ err", err)
                res_cb(err, null);
            }
        })

    }
}
const Handle_File = new handle_file();
export default Handle_File