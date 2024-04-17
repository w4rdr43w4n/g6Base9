echo "Generating new ssh key..."
ssh-keygen -t ed25519 -C "zwerdos123@gmail.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/ed25519
echo "Now go to Github and past the content of .pub file there in new ssh key"
echo "Testing connection..."
ssh -T git@github.com

