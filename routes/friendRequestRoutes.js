const router = require('express').Router();
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});
const auth = require("../middleware/auth");
const {postInvite, postAccept, postReject} = require('../controllers/friendInvitationControllers');

const invitationSchema = Joi.object({
    targetMailAddress: Joi.string().email().required(),
  });

  const invitationDecisionSchema = Joi.object({
    id: Joi.string().required(),
  });

router.post('/invite', auth, validator.body(invitationSchema), postInvite);

router.post('/accept', auth, validator.body(invitationDecisionSchema), postAccept);

router.post('/reject', auth, validator.body(invitationDecisionSchema), postReject)

module.exports = router;