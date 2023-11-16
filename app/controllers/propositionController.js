const propositionService = require('../services/proposition');

function createProposition(req, res, next) {
    propositionService.createProposition(req.auth.id, req.params.id, req.body)
        .then(proposition => res.json(proposition))
        .catch(err => next(err));
}

function viewPropositions(req, res, next) {
    propositionService.viewPropositions(req.auth.id, req.params.id ?? unde)
        .then(propositions => res.json(propositions))
        .catch(err => next(err));
}

function changeProposition(req, res, next) {
    propositionService.changeProposition(req.auth.id, req.params.id, req.body)
        .then(proposition => res.json(proposition))
        .catch(err => next(err));
}

function acceptProposition(req, res, next) {
    propositionService.endProposition(req.auth.id, req.params.id, 'Accepted')
        .then(proposition => res.json(proposition))
        .catch(err => next(err));
}

function declineProposition(req, res, next) {
    propositionService.endProposition(req.auth.id, req.params.id, 'Rejected')
        .then(proposition => res.json(proposition))
        .catch(err => next(err));
}

module.exports = propositionController = {
    createProposition,
    viewPropositions,
    changeProposition,
    acceptProposition,
    declineProposition
};