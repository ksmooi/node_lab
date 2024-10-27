module.exports = {
    apps: [
        {
            name: 'pm2-cluster-app',
            script: './dist/apps/cluster_server/server.js',
            instances: 'max',                // Create one worker process for each available CPU core
            exec_mode: 'cluster',            // Run the app in cluster mode to scale across all CPU cores
            max_restarts: 5,                 // Allow up to 5 restarts
            restart_delay: 5000,             // 5-second delay between restarts
            exp_backoff_restart_delay: 100,  // Exponential backoff for restart delays
        },
    ],
};
