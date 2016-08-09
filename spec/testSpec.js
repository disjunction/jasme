describe("bootScript", function() {
    it("can change jasmine property", function() {
        //console.log(jasmine);
        expect(jasmine.bootFlag).toBe(true);
    });
});

