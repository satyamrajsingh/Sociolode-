//first require the post Schema in Post and comment Schema in Comment
const Post=require('../models/post');
const Comment=require('../models/comment');
const Like=require('../models/like');

module.exports.create=async function(req,res){
      try{
       let post= await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        if(req.xhr){
               // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            post = await post.populate('user', 'name').execPopulate();


            return res.status(200).json({
                data:{
                    post:post
                },
                message: "Post created"
            })
        }

        req.flash('success','Post Published');
        return res.redirect('back');

      }catch(err){
        req.flash('error',err);
        console.log('Error', err);
        return res.redirect('back');
      }


   
}

module.exports.destroy=async function(req,res){
      
    try{
        //id is passed by the view in params
        let post = await Post.findById(req.params.id);

        if (post.user == req.user.id){
            // CHANGE :: delete the associated likes for the post and all its comments' likes too
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});

            
            post.remove();

            await Comment.deleteMany({post: req.params.id});
            req.flash('success','Post and Associated comments Deleted')

            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post_id:req.params.id
                    },
                    message: "Post Deleted"
                })
            }

            return res.redirect('back');
        }else{
            req.flash('err','Not Authorised to Delete Post')
            return res.redirect('back');
        }

    }catch(err){
        req.flash('error',err);
        return res.redirect('back');
    }


}