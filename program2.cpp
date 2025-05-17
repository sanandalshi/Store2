#include <bits/stdc++.h>
using namespace std;

void minOrbs(vector<string>& r, string t,int &ans) {
    unordered_map<string, vector<string>> g;
    unordered_map<string, int> o;

    for (const auto& rec : r) {
        vector<string> ing;
        string res = "";
        bool isRes = false;
        for (char c : rec) {
            if (c == '=') {
                isRes = true;
            } else if (c == '+') {
                ing.push_back(res);
                res = "";
            } else {
                res += c;
            }
        }
        ing.push_back(res);
        g[ing.back()] = ing;
        o[ing.back()] = ing.size() - 1;
    }

    vector<string> q = {t};
    unordered_map<string, bool> vis;
    int minO = INT_MAX;

    while (!q.empty()) {
        string cur = q.front();
        q.erase(q.begin());

        if (vis.count(cur)) continue;
        vis[cur] = true;

        if (g.count(cur)) {
            for (const auto& ing : g[cur]) {
                if (ing != cur) {
                    q.push_back(ing);
                    minO = min(minO, o[cur] + o[ing]);
                }
            }
        } else {
            minO = min(minO, o[cur]);
        }
    }

  ans= minO;
}

int main() {
    int n;
    cin >> n;
    vector<string> r(n);
    for (int i = 0; i < n; i++) {
        cin >> r[i];
    }
    string t;
    cin >> t;
  int ans=0;
     minOrbs(r, t,ans);
  cout<<ans;
    return 0;
}