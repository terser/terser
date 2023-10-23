issue_1413_top_retain_reference_value_equal_length: {
    options = {
        defaults: true,
        inline: 3,
        passes: 2,
        top_retain: "g",
    }
    input: {
        const g = 1;
        console.log(g);
    }
    expect: {
        const g = 1;
        console.log(1);
    }
}
issue_1413_top_retain_reference_shorter_than_value: {
    options = {
        defaults: true,
        inline: 3,
        passes: 2,
        top_retain: "g",
    }
    input: {
        const g=100082918280;
        console.log(g);
    }
    expect: {
        const g=100082918280;
        console.log(g);
    }
}
issue_1413_top_retain_reference_shorter_than_value_2: {
    options = {
        defaults: true,
        inline: 3,
        passes: 2,
        top_retain: "a,aa,aaa,aaaa,aaaaa,aaaaaa,aaaaaaa,aaaaaaaa,aaaaaaaaa,aaaaaaaaaa,aaaaaaaaaaa,aaaaaaaaaaaa,aaaaaaaaaaaaa,aaaaaaaaaaaaaa,aaaaaaaaaaaaaaa,aaaaaaaaaaaaaaaa,aaaaaaaaaaaaaaaaa,aaaaaaaaaaaaaaaaaa,aaaaaaaaaaaaaaaaaaa,aaaaaaaaaaaaaaaaaaaa,aaaaaaaaaaaaaaaaaaaaa,aaaaaaaaaaaaaaaaaaaaaa,aaaaaaaaaaaaaaaaaaaaaaa,aaaaaaaaaaaaaaaaaaaaaaaa,aaaaaaaaaaaaaaaaaaaaaaaaa,aaaaaaaaaaaaaaaaaaaaaaaaaa,aaaaaaaaaaaaaaaaaaaaaaaaaaa",
    }
    input: {
        const a = 1;
        console.log(a)
        const aa = 1;
        console.log(aa)
        const aaa = 1;
        console.log(aaa)
        const aaaa = 1;
        console.log(aaaa)
        const aaaaa = 1;
        console.log(aaaaa)
        const aaaaaa = 1;
        console.log(aaaaaa)
        const aaaaaaa = 1;
        console.log(aaaaaaa)
        const aaaaaaaa = 1;
        console.log(aaaaaaaa)
        const aaaaaaaaa = 1;
        console.log(aaaaaaaaa)
        const aaaaaaaaaa = 1;
        console.log(aaaaaaaaaa)
        const aaaaaaaaaaa = 1;
        console.log(aaaaaaaaaaa)
        const aaaaaaaaaaaa = 1;
        console.log(aaaaaaaaaaaa)
        const aaaaaaaaaaaaa = 1;
        console.log(aaaaaaaaaaaaa)
        const aaaaaaaaaaaaaa = 1;
        console.log(aaaaaaaaaaaaaa)
        const aaaaaaaaaaaaaaa = 1;
        console.log(aaaaaaaaaaaaaaa)
        const aaaaaaaaaaaaaaaa = 1;
        console.log(aaaaaaaaaaaaaaaa)
        const aaaaaaaaaaaaaaaaa = 1;
        console.log(aaaaaaaaaaaaaaaaa)
        const aaaaaaaaaaaaaaaaaa = 1;
        console.log(aaaaaaaaaaaaaaaaaa)
        const aaaaaaaaaaaaaaaaaaa = 1;
        console.log(aaaaaaaaaaaaaaaaaaa)
        const aaaaaaaaaaaaaaaaaaaa = 1;
        console.log(aaaaaaaaaaaaaaaaaaaa)
        const aaaaaaaaaaaaaaaaaaaaa = 1;
        console.log(aaaaaaaaaaaaaaaaaaaaa)
        const aaaaaaaaaaaaaaaaaaaaaa = 1;
        console.log(aaaaaaaaaaaaaaaaaaaaaa)
        const aaaaaaaaaaaaaaaaaaaaaaa = 1;
        console.log(aaaaaaaaaaaaaaaaaaaaaaa)
        const aaaaaaaaaaaaaaaaaaaaaaaa = 1;
        console.log(aaaaaaaaaaaaaaaaaaaaaaaa)
        const aaaaaaaaaaaaaaaaaaaaaaaaa = 1;
        console.log(aaaaaaaaaaaaaaaaaaaaaaaaa)
        const aaaaaaaaaaaaaaaaaaaaaaaaaa = 1;
        console.log(aaaaaaaaaaaaaaaaaaaaaaaaaa)
        const aaaaaaaaaaaaaaaaaaaaaaaaaaa = 1;
        console.log(aaaaaaaaaaaaaaaaaaaaaaaaaaa)
    }
    expect: {
        const a=1;console.log(1);const aa=1;console.log(1);const aaa=1;console.log(1);const aaaa=1;console.log(1);const aaaaa=1;console.log(1);const aaaaaa=1;console.log(1);const aaaaaaa=1;console.log(1);const aaaaaaaa=1;console.log(1);const aaaaaaaaa=1;console.log(1);const aaaaaaaaaa=1;console.log(1);const aaaaaaaaaaa=1;console.log(1);const aaaaaaaaaaaa=1;console.log(1);const aaaaaaaaaaaaa=1;console.log(1);const aaaaaaaaaaaaaa=1;console.log(1);const aaaaaaaaaaaaaaa=1;console.log(1);const aaaaaaaaaaaaaaaa=1;console.log(1);const aaaaaaaaaaaaaaaaa=1;console.log(1);const aaaaaaaaaaaaaaaaaa=1;console.log(1);const aaaaaaaaaaaaaaaaaaa=1;console.log(1);const aaaaaaaaaaaaaaaaaaaa=1;console.log(1);const aaaaaaaaaaaaaaaaaaaaa=1;console.log(1);const aaaaaaaaaaaaaaaaaaaaaa=1;console.log(1);const aaaaaaaaaaaaaaaaaaaaaaa=1;console.log(1);const aaaaaaaaaaaaaaaaaaaaaaaa=1;console.log(1);const aaaaaaaaaaaaaaaaaaaaaaaaa=1;console.log(1);const aaaaaaaaaaaaaaaaaaaaaaaaaa=1;console.log(1);const aaaaaaaaaaaaaaaaaaaaaaaaaaa=1;console.log(1);
    }
}