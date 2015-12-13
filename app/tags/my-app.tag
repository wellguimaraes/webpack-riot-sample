<my-app>
    <div>
        Hello, I'm a custom tag.
        <button onclick={toggleLipsum} class={active: lipsumVisible}>More info</button>
        <lipsum if={lipsumVisible}></lipsum>
    </div>
    
    <style>{styles}</style>
    
    <script>
        var tag = this;
        
        this.styles = require('./hello.scss');
        this.lipsumVisible = false;
        
        this.toggleLipsum = function() {
            this.lipsumVisible = !this.lipsumVisible;
            
            if (this.lipsumVisible)
                require(['./lipsum.tag'], function() {
                    window.riot.mount("lipsum");
                });
        };
    </script>
</my-app>