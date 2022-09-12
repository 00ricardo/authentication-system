export default function checkFormInputs(rp, data) {
    var required = []
    var [_status, response] = [undefined, { message: 'valid' }]
    rp.forEach(p => {
        if (!data.get(p)) {
            required.push(p)
            _status = { message: 'missing_params' }
        }
        if (!_status && p === 'email') {
            _status = validateEmail(data.get(p)) ? _status : { message: 'email_error' }
        }
    });

    if (!_status) {
        return response
    } else {
        if (_status['message'] === 'missing_params') {
            _status['missing'] = required
        }
        return _status
    }
};

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export const feedbackUserValidation = (required) => {
    if (required['missing']) {
        required['missing'].forEach(element => {
            document.getElementById(element).setAttribute('error', true)
        });
    }
    else if (required['message'] === 'error_email') {

    }
    else {
        return 200
    }
}