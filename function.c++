// Input: recipes = ["bread","sandwich","burger"], 
//        ingredients = [["yeast","flour"],["bread","meat"],["sandwich","meat","bread"]], 
//        supplies = ["yeast","flour","meat"]

// Output: ["bread","sandwich","burger"]

vector<string> findAllRecipes(vector<string>& recipes, vector<vector<string>>& ingredients, vector<string>& supplies) {
    int recipes_n = recipes.size();
    int ingredients_n = ingredients.size();
    int supplies_n = supplies.size();
    set<string> ans;
    vector<string> temp;

        for(int ingredients_i=0;ingredients_i<ingredients_n;ingredients_i++) {
                bool flag = true;
                for(int i=0;i<ingredients[ingredients_i].size();i++) {
                    for(int supplies_i=0;supplies_i<supplies_n;supplies_i++) {
                        if(ingredients[ingredients_i][i]==supplies[supplies_i]) {
                            ingredients[ingredients_i][i]="t";
                        }
                    }
                }
                for(int i=0;i<ingredients[ingredients_i].size();i++) {
                    if(ingredients[ingredients_i][i]!="t") {
                        flag=false;
                    }
                }
                if(flag) {
                    supplies.push_back(recipes[ingredients_i]);
                    ans.insert(recipes[ingredients_i]);
                } else {
                   auto t = recipes[ingredients_i];
                }
        }
     
    for(auto x:supplies) cout<<x<<" ";
    for(auto x:ans) temp.push_back(x);
    return temp;
}