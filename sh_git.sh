git config --global user.email "danrobert445@gmail.com"
git config --global user.name "Robert-Dan"

git add .
git status

read -p "Enter your commit message: " varname
varname=${varname:-message} #📋📋📋✏️✏️✏️📜📜📜} # 👌👌👌🙏🙏🙏✌️✌️✌️

git commit -m "$varname" #"git commit"
git remote add origin https://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@github.com/johnidevo/javascript.git
git push origin master

