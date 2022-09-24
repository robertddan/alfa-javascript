git config --global user.email "danrobert445@gmail.com"
git config --global user.name "Robert-Dan"

git add .
git status

read -p "Enter your commit message: " varname
varname=${varname:-message} #📋📋📋✏️✏️✏️📜📜📜} # 👌👌👌🙏🙏🙏✌️✌️✌️

git commit -m "$varname" #"git commit"
#git remote add origin https://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@github.com/johnidevo/javascript.git
git push origin master

