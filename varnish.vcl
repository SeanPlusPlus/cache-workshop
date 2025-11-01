vcl 4.1;

import directors;

# Backend servers (our Express apps)
backend app1 {
    .host = "app1";
    .port = "3000";
}

backend app2 {
    .host = "app2";
    .port = "3000";
}

backend app3 {
    .host = "app3";
    .port = "3000";
}

# Load balancer setup
sub vcl_init {
    new lb = directors.round_robin();
    lb.add_backend(app1);
    lb.add_backend(app2);
    lb.add_backend(app3);
}

# Use load balancer for backend selection
sub vcl_recv {
    set req.backend_hint = lb.backend();
    
    # Handle PURGE requests
    if (req.method == "PURGE") {
        return (purge);
    }
}

# Add cache status header so we can see hits/misses
sub vcl_deliver {
    if (obj.hits > 0) {
        set resp.http.X-Cache = "HIT";
    } else {
        set resp.http.X-Cache = "MISS";
    }
}
