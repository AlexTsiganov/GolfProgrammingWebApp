var express = require('express');
var router = express.Router();

var tasks = [
  { id: 1,
    href: '/task/1',
    title: 'Test task title with c language',
    description: 'Description',
    author: 'Alex'},
  { id: 2,
    href: '/task/2',
    title: 'Test task title with c++ language',
    description: 'Description',
    author: 'Ivan'}];
router.get('/:id', function(req, res, next)
{
  for (var t in tasks)
  {
    if (tasks[t].id == req.params.id)
    {
      res.render('task', { task: tasks[t],
                           langs: ['c++', 'Java', 'Python'] });
      break;
    }
  }
});

router.put('/solution', function (req, res, next)
{
  res.send(req.body);
  console.log(req.body);
});

module.exports = router;
